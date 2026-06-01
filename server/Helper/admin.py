from django.contrib import admin
from .models import Location,HelperService
# Register your models here.

class LocationAdmin(admin.ModelAdmin):
    list_display = ['country','city','area']
    search_fields = ['country','city','area']

admin.site.register(Location,LocationAdmin)

class HelperServiceAdmin(admin.ModelAdmin):
    list_display = ['user','service','price','experience_year','is_available']
    search_fields = ['service','location','price']
    list_filter = ['experience_year','is_available']


admin.site.register(HelperService,HelperServiceAdmin)
