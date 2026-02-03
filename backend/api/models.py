from django.db import models
from django.contrib.auth.models import User

class Asset(models.Model):
    CATEGORY_CHOICES = [
        ('transition', 'Transition'),
        ('overlay', 'Overlay'),
        ('effect', 'Effect'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    file = models.FileField(upload_to='assets/')
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_assets')
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class DownloadHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='downloads')
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='downloads')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} downloaded {self.asset.title}"
