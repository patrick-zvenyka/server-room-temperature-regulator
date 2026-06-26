from django.db import models
from django.utils import timezone

class ServerRackSensorLog(models.Model):
    """
    Records primary telemetry data points from IoT sensors attached to server racks.
    """
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    rack_identifier = models.CharField(max_length=100, db_index=True)
    temperature_celsius = models.FloatField()
    humidity_percentage = models.FloatField()

    class Meta:
        ordering = ['-timestamp']

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            self._check_thresholds()

    def _check_thresholds(self):
        # Prevent circular import if needed, or import at top
        from .models import ThermalAlert
        
        if self.temperature_celsius > 27.0:
            ThermalAlert.objects.create(
                sensor_log=self,
                alert_type='TEMPERATURE_HIGH',
                message=f'Temperature of {self.temperature_celsius}°C exceeds the 27°C maximum threshold.',
                timestamp=self.timestamp
            )
        elif self.temperature_celsius < 18.0:
            ThermalAlert.objects.create(
                sensor_log=self,
                alert_type='TEMPERATURE_LOW',
                message=f'Temperature of {self.temperature_celsius}°C is below the 18°C minimum threshold.',
                timestamp=self.timestamp
            )
            
        if self.humidity_percentage > 60.0:
            ThermalAlert.objects.create(
                sensor_log=self,
                alert_type='HUMIDITY_HIGH',
                message=f'Humidity of {self.humidity_percentage}% exceeds the 60% maximum threshold.',
                timestamp=self.timestamp
            )
        elif self.humidity_percentage < 40.0:
            ThermalAlert.objects.create(
                sensor_log=self,
                alert_type='HUMIDITY_LOW',
                message=f'Humidity of {self.humidity_percentage}% is below the 40% minimum threshold.',
                timestamp=self.timestamp
            )

    def __str__(self):
        return f"{self.rack_identifier} - {self.temperature_celsius}°C, {self.humidity_percentage}% at {self.timestamp}"


class ThermalAlert(models.Model):
    """
    Captures real-time alerts when temperature/humidity levels breach ASHRAE standards 
    or critical dynamic thresholds.
    """
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    sensor_log = models.ForeignKey(ServerRackSensorLog, on_delete=models.CASCADE, related_name='alerts', null=True, blank=True)
    alert_type = models.CharField(max_length=50)  # e.g., 'TEMPERATURE_HIGH', 'HUMIDITY_LOW'
    message = models.TextField()
    resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.alert_type}] {self.message} (Resolved: {self.resolved})"
