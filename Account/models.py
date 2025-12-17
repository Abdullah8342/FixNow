'''Account Model'''
from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    '''
    Docstring for User
    '''
    STATUS_OPTION = [
        ('Helper','HELPER'),
        ('Customer','CUSTOMER')
    ]
    email = models.EmailField(unique=True)
    status = models.CharField(max_length=15,choices=STATUS_OPTION,default='Customer')
