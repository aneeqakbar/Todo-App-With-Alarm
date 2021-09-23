from django.contrib import admin
from .models import Alarm, Habit, Routine, Todo
# Register your models here.

admin.site.register(Habit)
admin.site.register(Routine)
admin.site.register(Todo)
admin.site.register(Alarm)