from django.urls import path
from .views import Profile,ProfileUpdate

urlpatterns = [
    path('',Profile,name='Profile'),
    path('update/',ProfileUpdate,name='ProfileUpdate'),
]
