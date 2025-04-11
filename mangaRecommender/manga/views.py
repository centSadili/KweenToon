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
    if not query:
        return Response({"error": "Search query is required"}, status=status.HTTP_400_BAD_REQUEST)

    url = f'https://api.jikan.moe/v4/manga'
    params = {'q': query, 'limit': 10}
    try:
        res = requests.get(url, params=params)
        res.raise_for_status()  
        data = res.json().get('data', [])
        return Response(data)
    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_all_manga(request):
    url = f'https://api.jikan.moe/v4/manga'
    params = {'limit': 10}
    try:
        res = requests.get(url, params=params)
        res.raise_for_status() 
        data = res.json().get('data', [])
        return Response(data)
    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)