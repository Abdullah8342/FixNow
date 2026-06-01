from django.contrib import admin
from .models import Profile
# Register your models here.

# class ProfileAdmin(admin.ModelAdmin):
#     list_display = ['user','full_name','phone']
#     search_fields = ['full_name','phone']

admin.site.register(Profile)
