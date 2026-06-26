# pyrefly: ignore [missing-import]
from rest_framework import viewsets, mixins
# pyrefly: ignore [missing-import]
from rest_framework.views import APIView
# pyrefly: ignore [missing-import]
from rest_framework.response import Response
# pyrefly: ignore [missing-import]
from .models import ServerRackSensorLog, ThermalAlert
from .serializers import ServerRackSensorLogSerializer, ThermalAlertSerializer
# pyrefly: ignore [missing-import]
from .evaluation import generate_performance_metrics

class ServerRackSensorLogViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows sensor logs to be ingested (POST) or viewed (GET).
    """
    queryset = ServerRackSensorLog.objects.all()
    serializer_class = ServerRackSensorLogSerializer

    def get_queryset(self):
        from django.utils.dateparse import parse_datetime
        from datetime import datetime, time
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
        """
        Save the sensor log. Alerts are automatically handled by the model's save() method.
        """
        serializer.save()


class ThermalAlertViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows active alerts and historical logs to be viewed.
    """
    queryset = ThermalAlert.objects.all()
    serializer_class = ThermalAlertSerializer
    
    def get_queryset(self):
        """
        Optionally filter alerts by 'resolved' status using query params.
        Example: /api/monitoring/alerts/?resolved=false
        """
        queryset = ThermalAlert.objects.all()
        resolved_param = self.request.query_params.get('resolved')
        if resolved_param is not None:
            is_resolved = resolved_param.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(resolved=is_resolved)
        return queryset

class SystemEvaluationView(APIView):
    """
    API endpoint to retrieve the overall system performance evaluation metrics.
    """
    def get(self, request):
        metrics = generate_performance_metrics()
        return Response(metrics)
