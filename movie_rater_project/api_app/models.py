from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator


# Models
class Movie(models.Model):
    title = models.CharField(max_length=32)
    description = models.TextField(max_length=250)

    def __str__(self) -> str:
        return self.title

    def ratings_count(self):
        return Rating.objects.filter(movie=self).count()

    def average_rating(self):
        sum = 0
        ratings = Rating.objects.filter(movie=self)
        for rating in ratings:
            sum += rating.stars
        return sum / (len(ratings) if len(ratings) > 0 else 1 )


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        unique_together = (('user', 'movie'),)
        index_together = (('user', 'movie'),)

    def __str__(self) -> str:
        return self.user.username + ' ' + self.movie.title