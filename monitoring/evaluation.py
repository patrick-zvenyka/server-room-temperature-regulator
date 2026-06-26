from django.db.models import Count, Q, Avg
from .models import ServerRackSensorLog, ThermalAlert

def generate_performance_metrics():
    """
    Evaluates the performance of the system in maintaining optimal temperature levels.
    """
    total_logs = ServerRackSensorLog.objects.count()
    if total_logs == 0:
        return {
            "total_records": 0,
            "optimal_temperature_percentage": 0,
            "total_alerts": 0,
            "average_temperature": 0
        }

    # Optimal range is 18 - 27 Celsius
    optimal_logs = ServerRackSensorLog.objects.filter(
        temperature_celsius__gte=18.0, 
        temperature_celsius__lte=27.0
    ).count()

    optimal_percentage = (optimal_logs / total_logs) * 100

    total_alerts = ThermalAlert.objects.count()
    
    avg_temp = ServerRackSensorLog.objects.aggregate(Avg('temperature_celsius'))['temperature_celsius__avg']

    return {
        "total_records": total_logs,
        "optimal_temperature_percentage": round(optimal_percentage, 2),
        "total_alerts": total_alerts,
        "average_temperature": round(avg_temp, 2) if avg_temp else 0
    }
