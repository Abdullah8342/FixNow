from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from Helper.models import HelperService
from Helper.serializers import HelperServiceSerializers
from .models import Booking

User = get_user_model()


class BookingSerializers(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    booked_by_name = serializers.SerializerMethodField(read_only=True)
    booked_by_email = serializers.EmailField(source="user.email", read_only=True)

    helper_service_id = serializers.PrimaryKeyRelatedField(
        queryset=HelperService.objects.all(), write_only=True, source="helper_service"
    )
    helper_service = HelperServiceSerializers(read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "booked_by_name",
            "booked_by_email",
            "helper_service",
            "helper_service_id",
            "status",
            "scheduled_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_scheduled_at(self,value):
        min_time = timezone.now() + timezone.timedelta(minutes=15)
        if value < min_time:
            raise serializers.ValidationError("Booking must be at least 15 minutes in the future.")
        return value

    def validate(self, attrs):
        request_user = self.context['request'].user

        # Status-only PATCH requests should not re-run booking creation rules.
        if self.instance and set(attrs.keys()).issubset({"status"}):
            return super().validate(attrs)

        helper_service = attrs.get('helper_service', getattr(self.instance, 'helper_service', None))
        scheduled_at = attrs.get('scheduled_at', getattr(self.instance, 'scheduled_at', None))

        if helper_service is not None:
            if request_user == helper_service.user:
                raise serializers.ValidationError("You Cannot Book Your Own Service")

            if not helper_service.is_available:
                raise serializers.ValidationError("Unavailable Service")

        if helper_service is not None and scheduled_at is not None:
            conflict = Booking.objects.filter(
                helper_service=helper_service,
                scheduled_at=scheduled_at,
                status__in=["Pending", "Accepted"],
            )

            if self.instance:
                conflict = conflict.exclude(pk=self.instance.pk)

            if conflict.exists():
                raise serializers.ValidationError("Helper already booked at this time")

        return super().validate(attrs)

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

    def get_booked_by_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.email

    def update(self, instance, validated_data):
        request = self.context.get('request')
        # Handle status transitions explicitly to enforce rules
        new_status = validated_data.get('status') if 'status' in validated_data else None

        if new_status and new_status != instance.status:
            # Provider-only transitions: Accept, In Progress, Completed
            provider_user = instance.helper_service.user

            try:
                if new_status == 'Accepted':
                    if request.user != provider_user and not getattr(request.user, 'is_staff', False):
                        raise PermissionDenied('Not allowed to accept this booking')
                    instance.accept()
                    instance.refresh_from_db()
                    return instance

                if new_status == 'In Progress':
                    if request.user != provider_user and not getattr(request.user, 'is_staff', False):
                        raise PermissionDenied('Not allowed to mark in progress')
                    instance.in_progress()
                    instance.refresh_from_db()
                    return instance

                if new_status == 'Completed':
                    if request.user != provider_user and not getattr(request.user, 'is_staff', False):
                        raise PermissionDenied('Not allowed to complete this booking')
                    instance.complete()
                    instance.refresh_from_db()
                    return instance

                # Rejected can be set by provider or customer (cancel)
                if new_status == 'Rejected':
                    if request.user != provider_user and request.user != instance.user and not getattr(request.user, 'is_staff', False):
                        raise PermissionDenied('Not allowed to reject/cancel this booking')
                    instance.cancel()
                    instance.refresh_from_db()
                    return instance

                # For any other status transitions, deny
                raise serializers.ValidationError({'status': 'Invalid status transition'})

            except DjangoValidationError as e:
                raise serializers.ValidationError({'detail': e.messages or str(e)})

        # No status change or other fields updated - delegate to default
        return super().update(instance, validated_data)
