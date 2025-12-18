from django.shortcuts import render

# Create your views here.

def Profile(request):
    return render(request,'Profile/Profile.html')

def ProfileUpdate(request):
    if request.method == 'POST':
        pass
    return render(request,'Profile/Profile-Form.html')
