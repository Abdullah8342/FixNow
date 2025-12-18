from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login,get_user_model

user = get_user_model()
# Create your views here.
def SignUp(request):
    if request.method == 'POST':
        username = request.POST['Username']
        email = request.POST['Email']
        password = request.POST['Password']
        conformPassword = request.POST['ConfirmPassword']
        status = request.POST['Status']
        if password == conformPassword:
            newUser = user.objects.create_user(username=username,email=email,password=password,status = status)
            # newUser.status = status
            newUser.save()
            return redirect(LogInView)
        else:
            print(f'Password {password} And ConformPassword {conformPassword} Are Not Equal {status}')

    return render(request,'./Account/Signup.html')

def LogInView(request):
    if request.method == 'POST':
        username = request.POST['loginUsername']
        password = request.POST['loginPassword']
        user = authenticate(request, username=username, password=password)
        # print(f'User Name : {username} ,This is Password {password}')
        if user is not None:
            login(request,user)
            if request.user.status == 'Helper':
                print('Helper Profile')
                return redirect('ProfileUpdate')
            return redirect('Home')
        else:
            return render(request,'Account/Login.html')
    return render(request,'Account/Login.html')

def PasswordReset(request):
    return render(request,'./Account/Reset.html')


def Home(request):
    return render(request,'Account/Home.html')
