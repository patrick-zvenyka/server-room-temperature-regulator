from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServerRackSensorLogViewSet, ThermalAlertViewSet

router = DefaultRouter()
router.register(r'logs', ServerRackSensorLogViewSet, basename='sensorlog')
router.register(r'alerts', ThermalAlertViewSet, basename='thermalalert')

urlpatterns = [
    path('', include(router.urls)),
]
