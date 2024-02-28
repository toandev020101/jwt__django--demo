from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer
from .utils import send_code_to_email


# Create your views here.
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()
        user = serializer.data
        send_code_to_email(user['email'])
        return Response({'data': user, 'message': f'Xin chào, {user["first_name"]}'}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
