from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class Service(models.Model):
    title = models.CharField(max_length=100,unique=True)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)


    def __str__(self):
        return f'{self.title}'
