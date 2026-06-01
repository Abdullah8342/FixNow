from django.urls import path
from .views import ProfileView,ProfileDetailsView,ProviderPublicProfileView

urlpatterns = [
    path('',ProfileView.as_view(),name='profile'),
    path('provider/<int:user_id>/', ProviderPublicProfileView.as_view(), name='provider-public-profile'),
    path('<int:pk>/',ProfileDetailsView.as_view(),name='profile-view')
]
