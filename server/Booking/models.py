from django.core.exceptions import ValidationError
from django.utils import timezone
from django.conf import settings
from django.db import models
from Helper.models import HelperService
User = settings.AUTH_USER_MODEL
# Create your models here.


class Booking(models.Model):
    STATUS_CHOICES = [
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("In Progress", "In Progress"),
        ("Pending", "Pending"),
        ("Completed", "Completed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="booking")
    helper_service = models.ForeignKey(
        HelperService, on_delete=models.CASCADE, related_name="helper_service"
    )
    status = models.CharField(max_length=150, choices=STATUS_CHOICES, default="Pending")
    scheduled_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.helper_service} - {self.status}"

    def clean(self):
        old_values = None
        if self.pk:
            old_values = Booking.objects.filter(pk=self.pk).values(
                "user_id",
                "helper_service_id",
                "scheduled_at",
                "status",
            ).first()

        helper_service_changed = not old_values or old_values["helper_service_id"] != self.helper_service_id
        scheduled_at_changed = not old_values or old_values["scheduled_at"] != self.scheduled_at
        is_new = old_values is None

        # Only apply booking creation / rescheduling rules when creating or changing the booking data.
        if is_new or helper_service_changed or scheduled_at_changed:
            if self.user == self.helper_service.user:
                raise ValidationError("You Cannot Book Your Own Service")

            if not self.helper_service.is_available:
                raise ValidationError("Unavailable Service")

            min_time = timezone.now() + timezone.timedelta(minutes=15)
            if self.scheduled_at < min_time:
                raise ValidationError("Booking must be at least 15 minutes in the future.")

            conflict = (
                Booking.objects.filter(
                    helper_service=self.helper_service,
                    scheduled_at=self.scheduled_at,
                    status__in=["Pending", "Accepted"],
                )
                .exclude(pk=self.pk)
                .exists()
            )

            if conflict:
                raise ValidationError("Helper already booked at this time")

    def save(self,*args,**kwargs):
        update_fields = kwargs.get("update_fields")
        # Status-only updates should not re-run scheduling validations.
        if not (update_fields and set(update_fields).issubset({"status", "updated_at"})):
            self.full_clean()
        return super().save(*args,**kwargs)

    def accept(self):
        if self.status != "Pending":
            raise ValidationError('Invalid Transition')
        self.status = "Accepted"
        self.save(update_fields = ['status'])

    def in_progress(self):
        if self.status != "Accepted":
            raise ValidationError('Invalid Transition')
        self.status = "In Progress"
        self.save(update_fields = ['status'])

    def complete(self):
        if self.status != "In Progress":
            raise ValidationError('Invalid Transition')
        self.status = "Completed"
        self.save(update_fields = ['status'])


    def cancel(self):
        if self.status == "Completed":
            raise ValidationError('Cannot Cancel Completed Booking')
        self.status = "Rejected"
        self.save(update_fields = ['status'])
