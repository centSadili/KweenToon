from rest_framework import serializers
from .models import History

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = [
            'history_id',
            'user_id',
            'mal_id',
            'date',
            'rating',
        ]
        read_only_fields = ['history_id', 'date']
        extra_kwargs = {
            'user_id': {'write_only': True},
            'mal_id': {'required': True, 'allow_blank': False},
            'rating': {'required': False, 'allow_null': True},
        }
from django.utils.translation import gettext_lazy as _