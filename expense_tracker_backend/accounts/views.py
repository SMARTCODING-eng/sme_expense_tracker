from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer, LoginSerializer, UserSerializer


# class UserRegistrationView(APIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = UserRegistrationSerializer

#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             token, _ = Token.objects.get_or_create(user=user)
#             # Use UserSerializer so the frontend receives complete user details (id, name, email)
#             user_data = UserSerializer(user).data
#             return Response({
#                 'token': token.key,
#                 'user': user_data,
#                 'message': 'Account created successfully!'
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            print("STEP 1: serializer valid")

            user = serializer.save()

            print("STEP 2: user created")
            print("USER:", user)
            print("USER ID:", user.id)

            token, created = Token.objects.get_or_create(user=user)

            print("STEP 3: token created")
            print("TOKEN:", token.key)

            user_data = UserSerializer(user).data

            print("STEP 4: serializer complete")

            return Response({
                'token': token.key,
                'user': user_data,
                'message': 'Account created successfully!'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("REGISTRATION ERROR:", repr(e))

            return Response(
                {
                    'detail': 'Registration failed.',
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
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
                # Use UserSerializer instead of self.serializer_class (LoginSerializer)
                user_data = UserSerializer(user).data
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
    serializer_class = None

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, Token.DoesNotExist):
            pass
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
