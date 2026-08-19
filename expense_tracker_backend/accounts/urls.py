from django.urls import path
from .views import (
    UserRegistrationView,
    LoginView,
    LogoutView,
    CurrentUserView,
    GoogleAuthView,
    GoogleCallbackView
)


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='account-register'),
    path('login/', LoginView.as_view(), name='account-login'),
    path('logout/', LogoutView.as_view(), name='account-logout'),
    path('google/', GoogleAuthView.as_view(), name='account-google'),
    path('google/callback/', GoogleCallbackView.as_view(), name='google_callback'),
    path('me/', CurrentUserView.as_view(), name='account-me'),
    
]
