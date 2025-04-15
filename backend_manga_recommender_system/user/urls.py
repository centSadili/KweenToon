from django.urls import path
from .views import register_user, get_users, user_login

urlpatterns = [
    path('register/', register_user, name='register'),
    path('users/', get_users, name='get_users'),
    path('login/', user_login, name='login'),
]