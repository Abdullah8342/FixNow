from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile
from Helper.serializers import HelperServiceSerializers

User = get_user_model()


class ProfileSerializers(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=serializers.CurrentUserDefault()
    )
    full_name = serializers.CharField(
        max_length=120, read_only=True, source="user.get_full_name"
    )
    email = serializers.EmailField(source="user.email", read_only=True)
    roll = serializers.ReadOnlyField(source="user.roll")
    service = HelperServiceSerializers(read_only=True, source="user.helper", many=True)
    profile_picture = serializers.ImageField(required=False)
    phone = serializers.CharField(required=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "full_name",
            "service",
            "roll",
            "email",
            "profile_picture",
            "phone",
        ]
        read_only_fields = ["id", "user", "service", "full_name", "email", "roll"]
