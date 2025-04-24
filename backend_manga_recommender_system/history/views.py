from django.shortcuts import render
from .serializers import HistorySerializer
from rest_framework.response import Response
from .models import History
from rest_framework.decorators import api_view
from rest_framework import status

# Create your views here.

@api_view(['GET', 'POST'])
def get_history(request):
    if request.method == 'GET':
        try:
            history = History.objects.all()
            serializer = HistorySerializer(history, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except History.DoesNotExist:
            return Response({"error": "History not found"}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST':
        serializer = HistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)