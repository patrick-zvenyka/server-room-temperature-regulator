from django.db import models
from django.contrib.auth.models import User

class UserActivityLog(models.Model):
    ACTION_CHOICES = (
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('NAVIGATION', 'Navigation'),
        ('SYSTEM_ACTION', 'System Action'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs', null=True, blank=True)
    action_type = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        username = self.user.username if self.user else "System"
        return f"[{self.action_type}] {username} - {self.timestamp}"
