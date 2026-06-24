from rest_framework import viewsets, mixins
from .models import ServerRackSensorLog, ThermalAlert
from .serializers import ServerRackSensorLogSerializer, ThermalAlertSerializer

class ServerRackSensorLogViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows sensor logs to be ingested (POST) or viewed (GET).
    """
    queryset = ServerRackSensorLog.objects.all()
    serializer_class = ServerRackSensorLogSerializer

    def perform_create(self, serializer):
        """
        Save the sensor log and automatically check for threshold breaches.
        """
        sensor_log = serializer.save()
        
        # Check against ASHRAE Standards for Server Rooms
        # Temperature: 18°C - 27°C
        if sensor_log.temperature_celsius > 27.0:
            ThermalAlert.objects.create(
                sensor_log=sensor_log,
                alert_type='TEMPERATURE_HIGH',
                message=f'Temperature of {sensor_log.temperature_celsius}°C exceeds the 27°C maximum threshold.'
            )
        elif sensor_log.temperature_celsius < 18.0:
            ThermalAlert.objects.create(
                sensor_log=sensor_log,
                alert_type='TEMPERATURE_LOW',
                message=f'Temperature of {sensor_log.temperature_celsius}°C is below the 18°C minimum threshold.'
            )
            
        # Optional: Add humidity checks if needed (e.g., 40% - 60%)
        if sensor_log.humidity_percentage > 60.0:
            ThermalAlert.objects.create(
                sensor_log=sensor_log,
                alert_type='HUMIDITY_HIGH',
                message=f'Humidity of {sensor_log.humidity_percentage}% exceeds the 60% maximum threshold.'
            )
        elif sensor_log.humidity_percentage < 40.0:
            ThermalAlert.objects.create(
                sensor_log=sensor_log,
                alert_type='HUMIDITY_LOW',
                message=f'Humidity of {sensor_log.humidity_percentage}% is below the 40% minimum threshold.'
            )


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
