from django.shortcuts import render


# Create your views here.
def SignUp(request):
    return render(request,'./Account/Signup.html')


def PasswordReset(request):
    return render(request,'./Account/Reset.html')
