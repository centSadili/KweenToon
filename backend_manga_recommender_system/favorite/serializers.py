from rest_framework import serializers
from .models import History

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = [
            'history_id',
            'user_id',
            'mal_id',
            'date',
        ]
        read_only_fields = ['history_id', 'date']
        extra_kwargs = {
            'user_id': {'write_only': True},
            'mal_id': {'required': True, 'allow_blank': False},
        }
from django.utils.translation import gettext_lazy as _