from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from rest_framework import viewsets,status,permissions
from django.db import models
from .serializers import BookingSerializers
from .models import Booking
from .permissions import IsOwner


# Create your views here.
class BookingViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated,IsOwner]
    def get_queryset(self):
        queryset = Booking.objects.select_related(
            "user",
            "helper_service",
            "helper_service__service",
            "helper_service__user",
        ).prefetch_related("helper_service__location")
        # If provider listing explicitly requested and user is provider/admin, return provider bookings
        if self.request.query_params.get("provider") == "1" and getattr(self.request.user, 'roll', None) in ["SP", "A"]:
            return queryset.filter(helper_service__user=self.request.user)

        # Allow access to bookings where the request user is either the customer or the provider
        if getattr(self.request.user, 'roll', None) in ["SP", "A"] or getattr(self.request.user, 'is_staff', False):
            return queryset.filter(models.Q(user=self.request.user) | models.Q(helper_service__user=self.request.user))

        return queryset.filter(user=self.request.user)

    serializer_class = BookingSerializers

    def get_serializer_context(self):
        return {'request':self.request}

    def destroy(self, request, *args, **kwargs):
        booking = get_object_or_404(Booking,id = kwargs['pk'])
        if booking.status in ["Accepted","In Progress","Completed"]:
            raise ValidationError("Can't Delete The Booking")
        return super().destroy(request, *args, **kwargs)
