from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Asset, DownloadHistory

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class AssetSerializer(serializers.ModelSerializer):
    uploader = UserSerializer(read_only=True)
    
    class Meta:
        model = Asset
        fields = ['id', 'title', 'category', 'file', 'uploader', 'upload_date']

class DownloadHistorySerializer(serializers.ModelSerializer):
    asset = AssetSerializer(read_only=True)
    
    class Meta:
        model = DownloadHistory
        fields = ['id', 'asset', 'timestamp']
