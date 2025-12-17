from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from HelperServices.models import HelperService

# Create your models here.

User = get_user_model()

class Hire(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='hires'
    )

    helper_service = models.ForeignKey(
        HelperService,
        on_delete=models.CASCADE,
        related_name='hires'
    )

    hire_date = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    def clean(self):
        if self.helper_service.helper.user == self.customer:
            raise ValidationError("You Can't Hire Yourself")

    def __str__(self):
        return f'Hire #{self.id} - {self.customer}'

    def save(self, *args,**kwargs):
        self.full_clean()
        super().save(*args,**kwargs)
