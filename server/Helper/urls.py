from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import LocationViewset,HelperServiceViewset

router = DefaultRouter()
router.register('location',LocationViewset)
router.register('helperservice',HelperServiceViewset)


urlpatterns = [
    path('',include(router.urls)),
]
