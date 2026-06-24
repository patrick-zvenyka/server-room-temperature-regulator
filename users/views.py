from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from .models import UserActivityLog
from .serializers import UserSerializer, UserActivityLogSerializer
from django.utils.dateparse import parse_datetime
from datetime import datetime, time

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserActivityLogViewSet(viewsets.ModelViewSet):
    queryset = UserActivityLog.objects.all().select_related('user')
    serializer_class = UserActivityLogSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = super().get_queryset()
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                queryset = queryset.filter(timestamp__gte=datetime.combine(start, time.min))
            except ValueError:
                pass
        
        if end_date:
            try:
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(timestamp__lte=datetime.combine(end, time.max))
            except ValueError:
                pass
                
        return queryset

    def perform_create(self, serializer):
        # Allow frontend to post custom actions (like NAVIGATION)
        serializer.save(user=self.request.user)
