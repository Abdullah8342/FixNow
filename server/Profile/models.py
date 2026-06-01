from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_picture/', blank=True)
    phone = models.CharField(max_length=11,blank=True)

    def __str__(self):
        return f'{self.user.get_full_name()} - Profile'
