from django.shortcuts import render
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

def index(request):
    return render(request, 'index.html')

@api_view(['GET'])
def search_manga(request):
    query = request.GET.get('q', '')
    limit = request.GET.get('limit', '')
    if not query:
        return Response({"error": "Search query is required"}, status=status.HTTP_400_BAD_REQUEST)

    url = f'https://api.jikan.moe/v4/manga'
    params = {'q': query, 'limit': limit}
    try:
        res = requests.get(url, params=params)
        res.raise_for_status()  
        data = res.json().get('data', [])
        return Response(data)
    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_all_manga(request):
    page = request.GET.get('page', 1)  
    url = 'https://api.jikan.moe/v4/manga'
    params = {
        'limit': 25,       
        'page': page
    }

    try:
        res = requests.get(url, params=params, timeout=5)
        res.raise_for_status()
        data = res.json().get('data', [])
        return Response(data)
    except requests.exceptions.RequestException as e:
        return Response(None, status=status.HTTP_200_OK)  # Fail silently (optional)
from django.core.cache import cache

@api_view(['GET'])
def get_manga_by_id(request):
    manga_id = request.GET.get('id', '')
    if not manga_id:
        return Response(None, status=status.HTTP_200_OK)

    cached = cache.get(manga_id)
    if cached:
        return Response(cached)

    url = f'https://api.jikan.moe/v4/manga/{manga_id}'
    try:
        res = requests.get(url, timeout=5)
        res.raise_for_status()
        data = res.json().get('data')
        if data:
            cache.set(manga_id, data, timeout=60 * 60)  # Cache for 1 hour
            return Response(data)
        else:
            return Response(None, status=status.HTTP_200_OK)
    except requests.exceptions.RequestException:
        return Response(None, status=status.HTTP_200_OK)
