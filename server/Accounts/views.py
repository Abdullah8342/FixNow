"""
Views.py
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import (
    UserSerializers,
    RequestOTPSerializer,
    VerifyOTPSerializer,
    PasswordResetSerializer,
    ContactUsSerializer,
)
from .utils import generate_otp, save_otp, verify_otp
from .tasks import send_otp_email, send_contact_email


def queue_otp_email(email, otp):
    """
    Send the OTP email through Celery when available.

    Fall back to a direct task run so the request does not fail in local
    development when the worker or broker is unavailable.
    """

    try:
        send_otp_email.delay(email, otp)
    except Exception:
        send_otp_email.run(email, otp)


def queue_contact_email(name, email, subject, message):
    """
    Send contact-us email through Celery, fallback to direct run in local dev.
    """

    try:
        send_contact_email.delay(name, email, subject, message)
    except Exception:
        send_contact_email.run(name, email, subject, message)

# Create your views here.


class Signup(CreateAPIView):
    """
    Signup
    """

    serializer_class = UserSerializers


class ForgetPassword(APIView):
    """
    Forget Password
    """

    def post(self, request):
        """
        Post Request
        """
        serializers = RequestOTPSerializer(data=request.data)
        serializers.is_valid(raise_exception=True)
        email = serializers.validated_data["email"]
        otp = generate_otp()
        save_otp(email, otp)
        queue_otp_email(email, otp)
        return Response({"message": "OTP sent to your email"})


class PasswordReset(APIView):
    """
    Password Reset
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        POST
        """
        serializers = PasswordResetSerializer(data=request.data)
        serializers.is_valid(raise_exception=True)
        password = serializers.validated_data["password"]
        current_user = request.user
        current_user.set_password(password)
        current_user.save()
        return Response({"message": "Password Changed Successfuly"})


class RequestOTPView(APIView):
    """
    reqest otp
    """

    def post(self, request):
        """
        Post Request
        """
        serializers = RequestOTPSerializer(data=request.data)
        serializers.is_valid(raise_exception=True)
        email = serializers.validated_data["email"]
        otp = generate_otp()
        save_otp(email, otp)
        queue_otp_email(email, otp)
        return Response({"message": "OTP sent"})


class VerifyOTPView(APIView):
    """
    VerifyOTPView
    """

    def post(self, request):
        """
        POST
        """
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        if not verify_otp(email, otp):
            return Response({"error": "Invalid OTP"}, status=400)

        user, _ = User.objects.get_or_create(email=email)
        user.is_verified = True
        user.save()
        refresh = RefreshToken.for_user(user)

        return Response({"access": str(refresh.access_token), "refresh": str(refresh)})


class ContactUsView(APIView):
    """
    Contact Us: send customer message to support email.
    """

    def post(self, request):
        serializer = ContactUsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        queue_contact_email(
            serializer.validated_data["name"],
            serializer.validated_data["email"],
            serializer.validated_data["subject"],
            serializer.validated_data["message"],
        )

        return Response({"message": "Our team will contact you shortly."})
