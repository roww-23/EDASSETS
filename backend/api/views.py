from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from .models import Asset
from .serializers import AssetSerializer, RegisterSerializer, UserSerializer, DownloadHistorySerializer
from . import services

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomLoginView, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({
            'token': token.key,
            'user': UserSerializer(token.user).data
        })

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all().order_by('-upload_date')
    serializer_class = AssetSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Use service to create asset (though ModelViewSet makes this redundant, 
        # we can just pass validated data to service if we override create, 
        # but for simplicity we hook into perform_create)
        # However, to strictly follow "Services separated", let's override create.
        pass
    
    def create(self, request, *args, **kwargs):
        # Using Service
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        asset = services.create_asset(
            user=request.user,
            title=serializer.validated_data.get('title'),
            category=serializer.validated_data.get('category'),
            file=serializer.validated_data.get('file')
        )
        
        # Serialize the created instance
        result_serializer = self.get_serializer(asset)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)

class DownloadAssetView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        asset = services.log_asset_download(request.user, pk)
        if asset:
            return Response({'status': 'download logged', 'file_url': asset.file.url})
        return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)

class UserDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        uploads = services.get_user_uploads(request.user)
        downloads = services.get_user_downloads(request.user)
        
        return Response({
            'uploads': AssetSerializer(uploads, many=True).data,
            'downloads': DownloadHistorySerializer(downloads, many=True).data
        })
