from django.urls import path
from django.contrib.auth.views import LoginView
from .views import SignUp,PasswordReset

urlpatterns = [
    path('Signup/',SignUp,name='Signup'),
    path('Login/',LoginView.as_view(template_name = 'Account/Login.html'),name = 'Login'),
    path('Reset/',PasswordReset,name='PasswordReset'),
]
