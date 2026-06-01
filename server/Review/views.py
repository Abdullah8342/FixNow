from django.conf import settings
from rest_framework import generics
from rest_framework import permissions
from .permissions import IsOwnerOrIsAdminOrReadOnly
from .serializers import ReviewSerializers
from .models import Review

User = settings.AUTH_USER_MODEL


class ReviewCreate(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Review.objects.all()
    serializer_class = ReviewSerializers

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class ReviewList(generics.ListAPIView):
    queryset = Review.objects.all().select_related(
        'user',
        'user__profile',
        'booking',
        'booking__helper_service',
        'booking__helper_service__service',
        'booking__helper_service__user',
    ).prefetch_related('booking__helper_service__location')
    serializer_class = ReviewSerializers
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ReviewUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrIsAdminOrReadOnly]
    queryset = Review.objects.all().select_related('user', 'booking').prefetch_related('booking__helper_service')
    serializer_class = ReviewSerializers

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
