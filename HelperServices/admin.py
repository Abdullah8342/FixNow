from django.contrib import admin
from .models import HelperService
# Register your models here.

# admin.site.register(HelperService)

@admin.register(HelperService)
class HelperServiceAdmin(admin.ModelAdmin):
    list_display = (
        'helper',
        'service',
        'hourly_price',
        'experience',
        'is_available',
    )
    list_filter = ('service','is_available')
