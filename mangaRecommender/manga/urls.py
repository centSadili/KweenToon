from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('search/', views.search_manga, name='search_manga'),
    path('allmanga/', views.get_all_manga, name='get_all_manga'),
]