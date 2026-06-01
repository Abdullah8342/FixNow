'''
    Serializers.py
'''
from rest_framework import serializers, exceptions
from .models import User
from .utils import verify_otp


class UserSerializers(serializers.ModelSerializer):
    """
    User Serializers
    """
    password = serializers.CharField(write_only = True)
    confirm_password = serializers.CharField(write_only = True)

    class Meta:
        """
        Meta
        """

        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "roll",
            "password",
            "confirm_password",
            "is_verified",
        ]
        read_only_fields = ["is_verified"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        confirm_password = validated_data.pop("confirm_password")
        if password != confirm_password:
            raise exceptions.ValidationError(
                "password and confirm password are not match"
            )
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class RequestOTPSerializer(serializers.Serializer):
    '''
    Request OTP Serializer
    '''
    email = serializers.EmailField()

    def validate_email(self,value):
        '''
            validating if the email exist
        '''
        user = User.objects.filter(email = value).first()
        if user is None:
            raise exceptions.NotFound(f"User With {value} Not Exist")
        return value



class VerifyOTPSerializer(serializers.Serializer):
    '''
    Verify OTP Serializer
    '''
    email = serializers.EmailField()
    otp = serializers.CharField()

    def validate(self, attrs):
        if not verify_otp(attrs['email'],attrs['otp']):
            raise exceptions.NotAuthenticated("Message : Invalid OTP")
        return super().validate(attrs)


class PasswordResetSerializer(serializers.Serializer):
    '''
        Password Reset Serializers
    '''
    password = serializers.CharField(write_only = True)
    confirm_password = serializers.CharField(write_only = True)

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Password Must Be Same")
        return super().validate(attrs)


class ContactUsSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField()
