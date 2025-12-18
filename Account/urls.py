from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import SignUp,PasswordReset,Home,LogInView

urlpatterns = [
    path('Signup/',SignUp,name='Signup'),
    path('Login/',LogInView,name = 'Login'),
    path('Logout/',LogoutView.as_view(),name = 'Logout'),
    path('Reset/',PasswordReset,name='PasswordReset'),
    path('',Home,name='Home'),
]
