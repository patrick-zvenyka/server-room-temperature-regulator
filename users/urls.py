from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserActivityLogViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')
router.register(r'activity', UserActivityLogViewSet, basename='activitylog')

urlpatterns = [
    # Need to specify a distinct path for activity logs to not clash with user detail routes.
    # We map 'activity' BEFORE the router URLs so it takes precedence.
    path('activity/', UserActivityLogViewSet.as_view({'get': 'list', 'post': 'create'}), name='activity-list'),
    path('', include(router.urls)),
]
