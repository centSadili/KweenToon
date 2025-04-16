from django.urls import path
from .views import search_manga, get_all_manga

urlpatterns = [
    path('manga/', get_all_manga, name='manga'),
    path('search_manga/', search_manga, name='search_manga'),
]