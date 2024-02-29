from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer, LoginSerializer
from .utils import send_code_to_email
from .models import OTP


# Create your views here.
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()
        user = serializer.data
        send_code_to_email(user['email'])
        return Response({'data': None, 'message': 'Đăng ký thành công'}, status=status.HTTP_201_CREATED)

    return Response({'errors': serializer.errors, 'message': 'Đăng ký thất bại!'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify_email(request):
    code = request.data.get('otp')
    try:
        otp = OTP.objects.get(code=code)
        user = otp.user
        if not user.is_verified:
            user.is_verified = True
            user.save()
            return Response({'message': 'Xác minh email thành công'}, status=status.HTTP_200_OK)

        return Response({'message': 'Mã không hợp lệ người dùng đã xác minh!'}, status=status.HTTP_204_NO_CONTENT)
    except OTP.DoesNotExist:
        return Response({'message': 'Mã không được cung cấp!'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    return Response({'data': serializer.data, 'message': 'Đăng nhập thành công'}, status=status.HTTP_200_OK)

