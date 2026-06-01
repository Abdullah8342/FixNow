from django.db import models

# Create your models here.
class Service(models.Model):
    name = models.CharField(max_length=150,unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="services/", blank=True, null=True)


    def __str__(self):
        return f'{self.name}'
