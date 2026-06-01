from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework import permissions
from rest_framework.status import HTTP_202_ACCEPTED
from rest_framework.response import Response
from .serializers import ProfileSerializers
from django.shortcuts import get_object_or_404
from .models import Profile
# Create your views here.

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self,request):
        queryset = get_object_or_404(Profile,user = request.user)
        serializers = ProfileSerializers(queryset)
        return Response(serializers.data)

    def patch(self,request):
        queryset = get_object_or_404(Profile,user = request.user)
        serializers = ProfileSerializers(
            queryset,data = request.data,
            context = {'request':request}
        )
        serializers.is_valid(raise_exception=True)
        serializers.save()
        return Response(status=HTTP_202_ACCEPTED)



class ProfileDetailsView(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializers


class ProviderPublicProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, user_id):
        queryset = get_object_or_404(Profile.objects.select_related('user').prefetch_related('user__helper__service', 'user__helper__location'), user_id=user_id, user__roll='SP')
        serializers = ProfileSerializers(queryset)
        return Response(serializers.data)
