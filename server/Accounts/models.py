from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

# Create your models here.


class CustomUserManager(BaseUserManager):

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
        Extending The AbstractUser Model

        Adding Roll Field, Using Email Instead of Default Username
    """

    SERVICE_PROVIDER = "SERVICE PROVIDER"
    SERICE_ACQUIRE = "SERVICE ACQUIRE"
    ADMIN = "ADMIN"
    ROLL_CHOICES = [("SP", SERVICE_PROVIDER), ("SA", SERICE_ACQUIRE), ("A", ADMIN)]
    roll = models.CharField(max_length=2, choices=ROLL_CHOICES)
    username = None
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.roll = 'A'
        elif not self.is_superuser and self.roll == 'A':
            raise ValueError("message: Only SuperUser Can Have Roll Admin")
        super().save(*args, **kwargs)


# REFACTOR: Remove If Else
