from django.urls import path
from .views import get_favorite, delete_favorite

urlpatterns = [
    path('favorite/',get_favorite,name='get_favorite'),  # Add the view function for getting history
    path('favorite/<int:pk>/', delete_favorite, name='delete_favorite')
]   