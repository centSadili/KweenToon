from django.db import models

# Create your models here.

class Favorite(models.Model):
    favorite_id = models.AutoField(primary_key=True, )
    user_id = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name="+")
    mal_id = models.CharField(max_length=100, default='')
    date = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"Favorite {self.favorite_id} for User {self.user_id} on Manga {self.mal_id}"

