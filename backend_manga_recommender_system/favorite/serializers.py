from rest_framework import serializers
from .models import Favorite

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = [
            'favorite_id',   # ✅ corrected field
            'user_id',
            'mal_id',
            'date',
        ]
        read_only_fields = ['favorite_id', 'date']
        extra_kwargs = {
            'user_id': {'write_only': True},
            'mal_id': {'required': True, 'allow_blank': False},
        }

from django.utils.translation import gettext_lazy as _