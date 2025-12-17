from django.db import models
from django.core.validators import MinValueValidator

# Create your models here.
from Profile.models import Profile
from Service.models import Service

class HelperService(models.Model):
    helper = models.ForeignKey(Profile,on_delete=models.CASCADE)
    service = models.ForeignKey(Service,on_delete=models.CASCADE)
    hourly_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.01,
        validators=[MinValueValidator(0.01)]
    )
    experience = models.CharField(max_length=100,help_text='1 Year,3 Month')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('helper','service')
        verbose_name = 'Helper Service'
        ordering = ['is_available']

    def __str__(self):
        return f'User {self.helper} - Service {self.service}'
