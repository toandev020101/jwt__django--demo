from django.conf import settings
from django.template.loader import render_to_string
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import User, OTP
from .serializers import RegisterSerializer, LoginSerializer, VerifyEmailSerializer, ResetPasswordSerializer, \
    ResetPasswordConfirmSerializer, SetNewPasswordSerializer, LogoutSerializer
from .utils import send_mail, generate_otp


# Create your views here.
@api_view(['POST'])
@authentication_classes([])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(email=user_data["email"])
        code = generate_otp()
        OTP.objects.create(code=code, user=user)

        client_url = settings.CLIENT_URL
        email_body = render_to_string('mail_verify.html', {
            "fullname": user.get_full_name,
            'client_url': client_url,
            'code': code
        })
        email_data = {
            'subject': 'Mã xác minh email của JWT_Django',
            'body': email_body,
            'to': user.email
        }
        send_mail(data=email_data, type="code")

        return Response({'data': None, 'message': 'Đăng ký thành công'}, status=status.HTTP_201_CREATED)

    return Response({'errors': serializer.errors, 'message': 'Đăng ký thất bại!'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([])
def verify_email(request):
    serializer = VerifyEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'data': serializer.data, 'message': 'Xác minh email thành công'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([])
def login(request):
    serializer = LoginSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    return Response({'data': serializer.data, 'message': 'Đăng nhập thành công'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def reset_password(request):
    serializer = ResetPasswordSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    return Response({'data': None, 'message': 'Một liên kết đã gửi đến email của bạn'},
                    status=status.HTTP_200_OK)


@api_view(['GET'])
def reset_password_confirm(request, uidb64, token):
    data = {
        'uidb64': uidb64,
        'token': token
    }
    serializer = ResetPasswordConfirmSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    return Response({'data': serializer.data, 'message': 'Xác minh đặt lại mật khẩu thành công'},
                    status=status.HTTP_200_OK)


@api_view(['PATCH'])
def set_new_password(request):
    serializer = SetNewPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'data': serializer.data, 'message': 'Đặt lại mật khẩu thành công'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    serializer = LogoutSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({'data': None, 'message': 'Đăng xuất thành công'}, status=status.HTTP_204_NO_CONTENT)
