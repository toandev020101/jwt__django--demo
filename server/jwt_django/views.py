from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer, LoginSerializer, VerifyEmailSerializer
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
    serializer = VerifyEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'data': serializer.data, 'message': 'Xác minh email thành công'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    return Response({'data': serializer.data, 'message': 'Đăng nhập thành công'}, status=status.HTTP_200_OK)

