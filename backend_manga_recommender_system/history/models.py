from django.db import models

# Create your models here.

class History(models.Model):
    history_id = models.AutoField(primary_key=True, )
    user_id = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name="+")
    manga_id = models.ForeignKey('manga.Manga', on_delete=models.CASCADE, related_name="+")
    date = models.DateTimeField(auto_now_add=True)
    rating = models.FloatField(default=0)
    status = models.CharField(max_length=10, default='reading')  # reading, completed, dropped

    def __str__(self):
        return f"History {self.history_id} for User {self.user_id} on Manga {self.manga_id}"
