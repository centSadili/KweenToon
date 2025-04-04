from django.db import models

# Create your models here.

class Manga(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=255)
    description = models.TextField()
    rating = models.FloatField()
    cover_image = models.URLField()