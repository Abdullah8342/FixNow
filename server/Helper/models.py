from django.db import models
from django.conf import settings
from Service.models import Service
User = settings.AUTH_USER_MODEL
# Create your models here.


class Location(models.Model):
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=150)
    area = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.country} | {self.city} | {self.area}"

    class Meta:
        unique_together = ['city','area']

class HelperService(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="helper")
    service = models.ForeignKey(
        Service, on_delete=models.SET_NULL, null=True, related_name="helper"
    )
    location = models.ManyToManyField(Location)
    price = models.DecimalField(decimal_places=2, max_digits=8)
    experience_year = models.PositiveIntegerField(null=True)
    is_available = models.BooleanField()
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        service_name = self.service.name if self.service else "Unassigned Service"
        return f"{self.user.get_full_name()} - {service_name}"

    class Meta:
        unique_together = ("user", "service")

# REFACTOR: If Later
