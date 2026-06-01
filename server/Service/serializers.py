from rest_framework import serializers
from .models import Service


class ServiceSerializers(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank = True,required = False)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Service
        fields = ['id','name','description','image']
        read_only_fields = ['id']
