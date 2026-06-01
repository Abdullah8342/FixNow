from django.core.exceptions import ValidationError
from django.db.models import Avg
from django.conf import settings
from django.db import models
from Booking.models import Booking

# Create your models here.
User = settings.AUTH_USER_MODEL


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="review")
    booking = models.ForeignKey(
        Booking, on_delete=models.CASCADE, related_name="review"
    )
    rating = models.PositiveIntegerField(default=3)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.booking}"

    def clean(self):
        if self.rating not in range(1, 6):
            raise ValidationError("Rating Must Be From One To Five")
        if self.booking.status != "Completed":
            raise ValidationError("Reviews Only Allowed After Service Completion")
        if self.booking.user != self.user:
            raise ValidationError("Only The Booking Customer Can Review")
        if Review.objects.filter(user=self.user, booking=self.booking).exists():
            raise ValidationError("You Already Reviewed This Booking")

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def get_helper_average_rating(self):
        """Get helper's average rating from all reviews"""
        helper_user = self.booking.helper_service.user
        avg = Review.objects.filter(
            booking__helper_service__user=helper_user
        ).aggregate(avg_rating=Avg("rating"))
        
        return round(avg['avg_rating'] or 0, 2)
