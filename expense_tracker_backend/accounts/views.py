from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer, LoginSerializer, UserSerializer, GoogleAuthSerializer


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
            email = serializer.validated_data['email'].lower()
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
                    'is_new_user': False,
                    'is_authenticated': True,
                    'message': 'Logged in successfully'
                }, status=status.HTTP_200_OK)

            return Response(
                {'detail': 'Invalid email or password.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = GoogleAuthSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email'].lower()
            full_name = serializer.validated_data.get('full_name', '')
            google_id = serializer.validated_data.get('google_id', '')
            id_token = serializer.validated_data.get('id_token', '')

            first_name, last_name = '', ''
            if full_name:
                parts = full_name.split(' ', 1)
                first_name = parts[0]
                if len(parts) > 1:
                    last_name = parts[1]

                is_new_user = False
                try:
                    user = User.objects.get(email__iexact=email)
                except User.DoesNotExist:
                    username = email.split('@')[0]
                    base_username = username
                    counter = 1
                    while User.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"
                        counter += 1

                        user = User.objects.create_user(
                            username=username,
                            email=email,
                            first_name=first_name,
                            last_name=last_name
                        )
                        is_new_user = True
                    token, _ = Token.objects.get_or_create(user=user)
                    user_data = UserSerializer(user).data
                    return Response({
                        'token': token.key,
                        'user': user_data,
                        'is_new_user': is_new_user,
                        'message': 'Account created with Gmail' if is_new_user else 'signed in with Gmail',
                    })
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = None

    def post(self, request):
        if request.user and request.user.is_authenticated:
            try:
                request.user.auth_token.delete()
            except (AttributeError, Token.DoesNotExist):
                pass
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

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
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        if request.user and request.user.is_authenticated:
            return Response({'user': serializer.data})

        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Token' ):
            token_key = auth_header.split(' ')[1]
            try:
                token = Token.objects.get(key=token_key)
                return Response({'user': serializer(token.user).data})
            except Token.DoesNotExist:
                pass
        return Response({'detail': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
