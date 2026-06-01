from django.contrib import admin
from .models import Booking
# Register your models here.

class BookingAdmin(admin.ModelAdmin):
    list_display = ['user','helper_service','status','scheduled_at','created_at','updated_at']

admin.site.register(Booking,BookingAdmin)
