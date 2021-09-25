from django.db import models
from django.contrib.auth.models import User
import datetime

PRIORITY = (('H','High'),('M','Medium'),('L','Low'))

class Habit(models.Model):
    user = models.ForeignKey(User, related_name='habits', on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.TextField()
    priority = models.CharField(max_length=2, choices=PRIORITY, default='M')
    checked = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Todo(models.Model):
    user = models.ForeignKey(User, related_name="todos", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.TextField()
    checked = models.BooleanField(default=False)
    timed = models.BooleanField(default=False)
    priority = models.CharField(max_length=2, choices=PRIORITY, default='M')
    time = models.DateTimeField(auto_now=False, auto_now_add=False)

    def __str__(self):
        return self.name

    def to_be_alarmed(self):
        difference = self.time.timestamp() - datetime.datetime.utcnow().timestamp()
        print(
            self.time.timestamp() - difference, datetime.datetime.utcnow().timestamp(),self.time.timestamp() - datetime.datetime.utcnow().timestamp()
        )
        return self.time.timestamp() > datetime.datetime.utcnow().timestamp()

class Routine(models.Model):
    user = models.ForeignKey(User, related_name="routine", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.TextField()
    checked = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Alarm(models.Model):
    name = models.CharField(max_length=50)
    file = models.FileField(upload_to='alarms/')

    def __str__(self):
        return self.name