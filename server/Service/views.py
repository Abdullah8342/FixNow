from rest_framework import viewsets
from .permissions import IsAdminOrReadOnly
from .serializers import ServiceSerializers
from .models import Service

# Create your views here.


class ServiceViewset(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Service.objects.all()
    serializer_class = ServiceSerializers
