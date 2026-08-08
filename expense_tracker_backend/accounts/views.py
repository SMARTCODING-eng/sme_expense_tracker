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
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserRegistrationSerializer(user).data
            return Response({
                'token': token.key,
                'user': user_data,
                'message': 'Account created successfully!'
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
                user_obj = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                return Response(
                    {'detail': 'Account does not exist. Please sign up first.'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            user = authenticate(username=user_obj.username, password=password)

            if user:
                token, _ = Token.objects.get_or_create(user=user)
                user_data = UserRegistrationSerializer(user).data
                return Response({
                    'token': token.key,
                    'user': user_data,
                    'message': 'Login successful'
                }, status=status.HTTP_200_OK)
            

            return Response(
                {'detail': 'Invalid email or password.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, Token.DoesNotExist):
            pass
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'user': UserRegistrationSerializer(request.user).data})
