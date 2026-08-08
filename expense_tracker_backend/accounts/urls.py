from django.urls import path
from .views import (
    UserRegistrationView,
    LoginView,
    LogoutView,
    CurrentUserView,
)


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='account-register'),
    path('login/', LoginView.as_view(), name='account-login'),
    path('logout/', LogoutView.as_view(), name='account-logout'),
    path('me/', CurrentUserView.as_view(), name='account-me'),
]