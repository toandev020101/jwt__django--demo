from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.encoding import smart_bytes, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, OTP
from .utils import send_mail


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=6)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    confirm_password = serializers.CharField(max_length=68, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'last_name', 'first_name']

    def validate(self, attrs):
        email = attrs.get('email')
        user_exists = User.objects.filter(email=email).exists()
        if user_exists:
            raise serializers.ValidationError({'email': 'Email đã tồn tại!'})

        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({'confirm_password': 'Mật khẩu không khớp!'})

        return attrs

    def create(self, validated_data):
        del validated_data['confirm_password']
        user = User.objects.create_user(**validated_data)
        return user


class VerifyEmailSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6, write_only=True)
    email = serializers.EmailField(max_length=255, min_length=6, read_only=True)
    full_name = serializers.CharField(max_length=255, read_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        fields = ['code', 'email', 'full_name', 'access_token', 'refresh_token']

    def validate(self, attrs):
        code = attrs.get('code')
        try:
            otp = OTP.objects.get(code=code)
            user = otp.user
            if user.is_verified:
                raise serializers.ValidationError({'code': 'Mã không hợp lệ người dùng đã xác minh!'})

            user.is_verified = True
            user.save()

            tokens = user.tokens()

            return {
                'email': user.email,
                'full_name': user.get_full_name,
                'access_token': str(tokens.get('access_token')),
                'refresh_token': str(tokens.get('refresh_token'))
            }
        except OTP.DoesNotExist:
            raise serializers.ValidationError({'code': 'Mã không được cung cấp!'})


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=6)
    password = serializers.CharField(max_length=68, write_only=True)
    full_name = serializers.CharField(max_length=255, read_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'access_token', 'refresh_token']

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        request = self.context.get('request')
        user = authenticate(request, email=email, password=password)

        if not user:
            raise serializers.ValidationError(
                {'email': 'Email hoặc mật khẩu không chính xác!', 'password': 'Email hoặc mật khẩu không chính xác!'})
        if not user.is_verified:
            raise serializers.ValidationError({'email': 'Email chưa được xác minh!'})

        tokens = user.tokens()

        return {
            'email': user.email,
            'full_name': user.get_full_name,
            'access_token': str(tokens.get('access_token')),
            'refresh_token': str(tokens.get('refresh_token'))
        }


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        user_exists = User.objects.filter(email=email).exists()
        if not user_exists:
            raise serializers.ValidationError({'email': 'Không tìm thấy tài khoản phù hợp!'})

        user = User.objects.get(email=email)

        if not user.is_verified:
            raise AuthenticationFailed({'email': 'Không tìm thấy tài khoản phù hợp!'})

        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        request = self.context.get('request')
        site_domain = get_current_site(request).domain
        relative_link = reverse(viewname="reset-password-confirm", kwargs={'uidb64': uidb64, 'token': token})
        abslink = f"http://{site_domain}{relative_link}"
        email_body = render_to_string('mail_reset_password.html', {
            "fullname": user.get_full_name,
            "abslink": abslink
        })
        email_data = {
            'subject': 'Lấy lại mật khẩu của bạn',
            'body': email_body,
            'to': user.email
        }
        send_mail(data=email_data, type="normal")

        return attrs


class ResetPasswordConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    class Meta:
        fields = ['uidb64', 'token']

    def validate(self, attrs):
        uidb64 = attrs.get('uidb64')
        token = attrs.get('token')

        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("Token không hợp lệ hoặc đã hết hạn!", 401)

            return {
                'uidb64': uidb64,
                'token': token
            }

        except DjangoUnicodeDecodeError:
            raise AuthenticationFailed("Token không hợp lệ hoặc đã hết hạn!", 401)


class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(max_length=100, min_length=6, write_only=True)
    new_password_confirm = serializers.CharField(max_length=100, min_length=6, write_only=True)
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    email = serializers.EmailField(max_length=255, min_length=6, read_only=True)
    full_name = serializers.CharField(max_length=255, read_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        fields = ['new_password', 'new_password_confirm', 'uidb64', 'token', 'email', 'full_name', 'access_token',
                  'refresh_token']

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        new_password_confirm = attrs.get('new_password_confirm')
        uidb64 = attrs.get('uidb64')
        token = attrs.get('token')

        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!", 401)

            if new_password != new_password_confirm:
                raise serializers.ValidationError({'new_password_confirm': "Mật khẩu không khớp!"})

            if user.check_password(new_password):
                raise serializers.ValidationError({'new_password': "Trùng với mật khẩu cũ!"})

            user.set_password(new_password)
            user.save()

            tokens = user.tokens()

            return {
                'email': user.email,
                'full_name': user.get_full_name,
                'access_token': str(tokens.get('access_token')),
                'refresh_token': str(tokens.get('refresh_token'))
            }

        except DjangoUnicodeDecodeError:
            raise AuthenticationFailed("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!", 401)


class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    default_error_message = {
        'bad_token': ('Token không hợp lệ hoặc đã hết hạn!')
    }

    def validate(self, attrs):
        self.token = attrs.get('refresh_token')
        return attrs

    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError:
            return self.fail('bad_token')


class GetOneUserByIdSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    full_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'avatar', 'full_name', 'email', 'gender', 'phone_number', 'date_joined', 'first_name',
                  'last_name']

    def validate(self, attrs):
        id = attrs.get('id')
        user_exists = User.objects.filter(id=id).exists()
        if not user_exists:
            raise serializers.ValidationError('Không tìm thấy tài khoản!')

        user = User.objects.get(id=id)
        user.full_name = user.get_full_name

        return user
