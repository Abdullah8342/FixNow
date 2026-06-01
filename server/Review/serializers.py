from rest_framework import serializers
from django.conf import settings
from django.db.models import Avg
from Booking.models import Booking
from .models import Review
from Helper.serializers import HelperServiceSerializers

User = settings.AUTH_USER_MODEL


class ReviewSerializers(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    reviewer_name = serializers.SerializerMethodField(read_only=True)
    reviewer_email = serializers.EmailField(source="user.email", read_only=True)
    reviewer_image = serializers.SerializerMethodField(read_only=True)
    booking_details = serializers.SerializerMethodField(read_only=True)
    helper_average_rating = serializers.SerializerMethodField(read_only=True)
    helper_service = HelperServiceSerializers(
        source='booking.helper_service', 
        read_only=True
    )
    booking = serializers.PrimaryKeyRelatedField(
        write_only=True, 
        queryset=Booking.objects.all()
    )
    
    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "reviewer_name",
            "reviewer_email",
            "reviewer_image",
            "booking",
            "booking_details",
            "rating",
            "comment",
            "helper_service",
            "helper_average_rating",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "booking_details", "helper_average_rating"]

    def get_booking_details(self, obj):
        return {
            "id": obj.booking.id,
            "service": obj.booking.helper_service.service.name,
            "scheduled_at": obj.booking.scheduled_at,
        }

    def get_reviewer_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.email

    def get_reviewer_image(self, obj):
        profile = getattr(obj.user, 'profile', None)
        if not profile or not profile.profile_picture:
            return None
        request = self.context.get('request')
        image_url = profile.profile_picture.url
        if request is not None:
            return request.build_absolute_uri(image_url)
        return image_url

    def get_helper_average_rating(self, obj):
        helper_user = obj.booking.helper_service.user
        avg = Review.objects.filter(
            booking__helper_service__user=helper_user
        ).aggregate(avg_rating=Avg("rating"))
        return round(avg['avg_rating'] or 0, 2)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


    def validate(self, attrs):
        request_user = self.context['request'].user
        booking = attrs.get('booking')
        rating = attrs.get('rating')

        if rating is None or rating < 1 or rating > 5:
            raise serializers.ValidationError("Rating must be from one to five")

        if booking is None:
            raise serializers.ValidationError({"booking": "Booking is required"})

        if booking.status != "Completed":
            raise serializers.ValidationError("Reviews are only allowed after service completion")

        if booking.user != request_user:
            raise serializers.ValidationError("Only the booking customer can review this service")

        if Review.objects.filter(user=request_user, booking=booking).exists():
            raise serializers.ValidationError("You already reviewed this booking")

        return attrs
