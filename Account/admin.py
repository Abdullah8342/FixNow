'''
Docstring for FinalYProject.FixNow.Account.admin
'''
from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
from .models import User
# Register your models here.

class CustomUserAdmin(UserAdmin):
    '''
    Docstring for CustomUserAdmin
    '''
    model = User
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    'email',
                    'first_name',
                    'last_name',
                    "password1",
                    "password2",
                    'status'
                ),
            },
        ),
    )


admin.site.register(User,CustomUserAdmin)
