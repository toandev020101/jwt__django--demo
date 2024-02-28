from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    confirm_password = serializers.CharField(max_length=68, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = ['last_name', 'first_name', 'email', 'password', 'confirm_password']

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
