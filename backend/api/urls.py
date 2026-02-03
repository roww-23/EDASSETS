from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssetViewSet, RegisterView, CustomLoginView, DownloadAssetView, UserDashboardView

router = DefaultRouter()
router.register(r'assets', AssetViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('assets/<int:pk>/download/', DownloadAssetView.as_view(), name='asset-download'),
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),
]
