from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


@shared_task
def send_otp_email(email, otp):
    """
    Send OTP email
    """

    message = f"""
Hello,

Your One-Time Password (OTP) for verification is:

{otp}

This code will expire in 5 minutes.

If you did not request this code, ignore this email.
Do not share this OTP with anyone.

Thanks,
FixNow Team
"""

    send_mail(
        subject="Your OTP Verification Code",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )


@shared_task
def send_contact_email(name, email, subject, message):
    """
    Send contact-us email to support/team inbox.
    """

    body = f"""
New Contact Us Message

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
"""

    send_mail(
        subject=f"[FixNow Contact] {subject}",
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.CONTACT_RECEIVER_EMAIL],
        fail_silently=False,
    )
