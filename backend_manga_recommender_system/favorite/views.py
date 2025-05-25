from django.shortcuts import render
from .serializers import FavoriteSerializer
from rest_framework.response import Response
from .models import Favorite
from rest_framework.decorators import api_view
from rest_framework import status
# Create your views here.

@api_view(['GET', 'POST'])
def get_favorite(request):
    if request.method == 'GET':
        try:
            history = Favorite.objects.all()
            serializer = FavoriteSerializer(history, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({"error": "History not found"}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST':
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
def delete_favorite(request, pk):
    try:
        favorite = Favorite.objects.get(pk=pk)
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Favorite.DoesNotExist:
        return Response({"error": "Favorite not found"}, status=status.HTTP_404_NOT_FOUND)