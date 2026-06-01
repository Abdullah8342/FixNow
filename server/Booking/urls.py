from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import BookingViewset

router = DefaultRouter()
router.register('api',BookingViewset,basename='booking')

urlpatterns = [
    path('',include(router.urls))
]
