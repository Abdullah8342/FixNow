
from django.db import models
from django.core.exceptions import ValidationError
from Hire.models import Hire


def rating_in_range(value):
    if value < 1 or value > 5:
        raise ValidationError('Rating Is In range 1 To 5')

class Review(models.Model):
    hire = models.OneToOneField(
        Hire,
        on_delete=models.CASCADE,
        related_name='review'
    )

    rating = models.PositiveSmallIntegerField(
        validators=[rating_in_range],
        help_text='Rating from 1 to 5',
        default=3,
    )

    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def clean(self):
        if self.hire.status != 'completed':
            raise ValidationError("You can only review a completed hire.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Review for Hire #{self.hire.id}'
