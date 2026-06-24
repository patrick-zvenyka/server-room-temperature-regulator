from rest_framework import serializers
from .models import ServerRackSensorLog, ThermalAlert

class ServerRackSensorLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServerRackSensorLog
        fields = ['id', 'timestamp', 'rack_identifier', 'temperature_celsius', 'humidity_percentage']
        read_only_fields = ['id', 'timestamp']


class ThermalAlertSerializer(serializers.ModelSerializer):
    sensor_log_details = ServerRackSensorLogSerializer(source='sensor_log', read_only=True)

    class Meta:
        model = ThermalAlert
        fields = ['id', 'timestamp', 'sensor_log', 'sensor_log_details', 'alert_type', 'message', 'resolved']
        read_only_fields = ['id', 'timestamp']
