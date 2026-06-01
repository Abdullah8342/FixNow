from rest_framework import serializers
from django.contrib.auth import get_user_model
from Service.serializers import ServiceSerializers
from Service.models import Service
from .models import Location, HelperService
User = get_user_model()

class LocationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "country", "city", "area"]
        read_only_fields = ["id"]




class HelperServiceSerializers(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only = True
    )
    provider_name = serializers.SerializerMethodField(read_only=True)
    provider_email = serializers.EmailField(source="user.email", read_only=True)
    provider_profile_picture = serializers.SerializerMethodField(read_only=True)
    service = ServiceSerializers(read_only = True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset = Service.objects.all(),
        write_only = True,
        source = 'service',
    )
    location_id = serializers.PrimaryKeyRelatedField(
        write_only = True,
        queryset = Location.objects.all(),
        many = True,
        source = 'location',
    )
    location = LocationSerializers(read_only = True,many = True)
    class Meta:
        model = HelperService
        fields = [
            "id",
            "user",
            "provider_name",
            "provider_email",
            "provider_profile_picture",
            "service_id",
            "service",
            "location_id",
            "location",
            "price",
            "experience_year",
            "is_available",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ['id','user','created_at','updated_at','service','location']



    def create(self, validated_data):
        validated_data['user'] = self.context['user']
        return super().create(validated_data)

    def validate(self, attrs):
        user = self.context.get('user')
        service = attrs.get('service', getattr(self.instance, 'service', None))

        if user is not None and service is not None:
            existing = HelperService.objects.filter(user=user, service=service)
            if self.instance is not None:
                existing = existing.exclude(pk=self.instance.pk)
            if existing.exists():
                raise serializers.ValidationError(
                    {'service_id': 'You already created a helper service for this service.'}
                )

        return super().validate(attrs)

    def get_provider_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.email

    def get_provider_profile_picture(self, obj):
        if hasattr(obj.user, 'profile') and obj.user.profile.profile_picture:
            return obj.user.profile.profile_picture.url
        return None


