from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from utils.permissions import IsAdmin

from .serializers import FixedContentSerializer, IsDisplayedStatusSerializer
from .models import FixedContent


class ListActiveFixedContentAPIView(generics.ListAPIView):
    serializer_class = FixedContentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = FixedContent.objects.filter(is_displayed=True)
        return qs


class RetrieveUpdateFixedContentStatusAPIView(generics.UpdateAPIView):
    serializer_class = IsDisplayedStatusSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_object(self):
        pk = self.kwargs.get("pk")
        return get_object_or_404(FixedContent, id=pk)
