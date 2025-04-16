from django.urls import path
from .views import search_manga, get_all_manga, get_manga_by_id

urlpatterns = [
    path('manga/', get_all_manga, name='manga'),
    path('manga/search_manga/', search_manga, name='search_manga'),
    path('manga/getbyid/', get_manga_by_id, name='getbyid_manga'),
]