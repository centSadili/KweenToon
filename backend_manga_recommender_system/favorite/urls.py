from django.urls import path
from .views import get_favorite

urlpatterns = [
    path('favorite/',get_favorite,name='get_favorite'),  # Add the view function for getting history
]