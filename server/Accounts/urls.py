'''
    Urls.py
'''
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)
from .views import Signup,RequestOTPView,VerifyOTPView,PasswordReset,ForgetPassword,ContactUsView

urlpatterns = [
    path("api/password-reset/",PasswordReset.as_view(),name='password-reset'),
    path("api/password-forget/",ForgetPassword.as_view(),name='password-forget'),
    path("api/contact-us/", ContactUsView.as_view(), name="contact-us"),
    path("", Signup.as_view(), name="signup"),
    path("api/request-otp/", RequestOTPView.as_view()),
    path("api/verify-otp/", VerifyOTPView.as_view()),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
