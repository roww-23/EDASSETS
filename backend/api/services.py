from .models import Asset, DownloadHistory

def create_asset(user, title, category, file):
    """
    Creates a new asset for the given user.
    """
    asset = Asset.objects.create(
        uploader=user,
        title=title,
        category=category,
        file=file
    )
    return asset

def log_asset_download(user, asset_id):
    """
    Logs that a user downloaded an asset.
    """
    try:
        asset = Asset.objects.get(id=asset_id)
        DownloadHistory.objects.create(user=user, asset=asset)
        return asset
    except Asset.DoesNotExist:
        return None

def get_user_downloads(user):
    return DownloadHistory.objects.filter(user=user).select_related('asset')

def get_user_uploads(user):
    return Asset.objects.filter(uploader=user)
