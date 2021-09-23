from django.urls import path
from . import views


app_name = 'core'

urlpatterns = [
    path('', views.HomeView, name='HomeView'),
    path('todos/', views.TodoView, name='TodoView'),
    path('api/habits/', views.HabitApiView.as_view(), name='HabitApiView'),
    path('api/todos/', views.TodoApiView.as_view(), name='TodoApiView'),
    path('api/routine/', views.RoutineApiView.as_view(), name='RoutineApiView'),
]
