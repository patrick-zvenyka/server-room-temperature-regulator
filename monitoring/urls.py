from django.urls import path, include
# pyrefly: ignore [missing-import]
from rest_framework.routers import DefaultRouter
from .views import ServerRackSensorLogViewSet, ThermalAlertViewSet, SystemEvaluationView

router = DefaultRouter()
router.register(r'logs', ServerRackSensorLogViewSet, basename='sensorlog')
router.register(r'alerts', ThermalAlertViewSet, basename='thermalalert')

urlpatterns = [
    path('evaluation/', SystemEvaluationView.as_view(), name='evaluation'),
    path('', include(router.urls)),
]
