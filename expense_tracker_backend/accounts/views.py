from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer, LoginSerializer, UserSerializer





class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user =serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserRegistrationSerializer(user).data
            return Response({
                'token' : token.key,
                'user' : user_data,
                'message' : 'Account created successfully!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user_obj = User.objects.get(email_iexact=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

            if user:
                token, _ = Token.objects.get_or_create(user=user)
                user_data = UserRegistrationSerializer(user).data
                return Response({
                    'token': token.key,
                    'user': user_data,
                    'message': 'login successful'
                })
            return Response({'detail': 'Invalid emial or password'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if request.user and request.user.is_authenticated:
            try:
                request.user.auth_token.delete()
            except Exception:
                pass
            return Response({'message': 'Logged out successfully'})

        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Token '):
            token_key = auth_header.split(' ')[1]
            try:
                token = Token.objects.get(key=token_key)
                token.delete()
            except Token.DoesNotExist:
                pass
        return Response({'message': 'Logged out successfully'})

 
class CurrentUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user and request.user.is_authenticated:
            return Response({'user': UserRegistrationSerializer(request.user).data})

        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Token '):
            token_key = auth_header.split(' ')[1]
            try:
                token = Token.objects.get(key=token_key)
                return Response({'user': UserRegistrationSerializer(token.user).data})

            except Token.DoesNotExist:
                pass
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
