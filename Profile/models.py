'''
Docstring
'''
from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator
# Create your models here.

class Profile(models.Model):
    '''
    Docstring for Profile
    '''
    AVAILABILITY_OPTIONS = [
        ('AVAILABLE','Avalilable'),
        ('BUSY','Busy'),
        ('OFFLINE','Offline')
    ]
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(blank=True,null=True,help_text='profile image')
    hourly_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.01,
        validators=[MinValueValidator(0.01)]
    )
    phone = models.CharField(max_length=12,help_text='+92 ... ')
    work_experience = models.CharField(max_length=20,help_text='1 year , 2 month')
    Avalilability_status = models.CharField(
        choices=AVAILABILITY_OPTIONS,
        default='AVAILABLE',
        max_length=20
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        '''
        Docstring for Meta
        '''
        verbose_name = 'Helper Profiles'
        ordering = ['-created_at']


    def __str__(self):
        return f'{self.user}'

    def get_average_rating(self):
        '''
        Docstring for average_rating
        '''
        return 'Average Rating'
