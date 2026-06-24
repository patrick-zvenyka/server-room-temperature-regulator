from django.db import models

class ServerRackSensorLog(models.Model):
    """
    Records primary telemetry data points from IoT sensors attached to server racks.
    """
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    rack_identifier = models.CharField(max_length=100, db_index=True)
    temperature_celsius = models.FloatField()
    humidity_percentage = models.FloatField()

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.rack_identifier} - {self.temperature_celsius}°C, {self.humidity_percentage}% at {self.timestamp}"


class ThermalAlert(models.Model):
    """
    Captures real-time alerts when temperature/humidity levels breach ASHRAE standards 
    or critical dynamic thresholds.
    """
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    sensor_log = models.ForeignKey(ServerRackSensorLog, on_delete=models.CASCADE, related_name='alerts', null=True, blank=True)
    alert_type = models.CharField(max_length=50)  # e.g., 'TEMPERATURE_HIGH', 'HUMIDITY_LOW'
    message = models.TextField()
    resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.alert_type}] {self.message} (Resolved: {self.resolved})"
