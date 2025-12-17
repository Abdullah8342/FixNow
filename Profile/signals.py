from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from .models import Profile
User = get_user_model()

# Signals
@receiver(post_save,sender=User)
def create_profile(created,instance,**kwargs):
    '''
    Docstring for create_profile
    
    :param self: Description
    :param created: Description
    :param instance: Description
    :param kwargs: Description
    '''
    if created and instance.status == 'Helper':
        Profile.objects.create(user = instance)
        print('Profile Created Successfuly')


@receiver(post_save,sender=User)
def update_profile(created,instance,**kwargs):
    '''
    Docstring for create_profile
    
    :param self: Description
    :param created: Description
    :param instance: Description
    :param kwargs: Description
    '''
    if created is False and instance.status == 'Helper':
        instance.profile.save()
        print('Profile Update Successfuly')
