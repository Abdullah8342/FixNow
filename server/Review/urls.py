from django.urls import path
from .views import ReviewCreate, ReviewList, ReviewUpdateDestroy


urlpatterns = [
    path('review/', ReviewCreate.as_view(), name="review-create"),
    path('reviews/', ReviewList.as_view(), name="review-list"),
    path('review/<int:pk>/', ReviewUpdateDestroy.as_view(), name="review-update-destroy"),
]
