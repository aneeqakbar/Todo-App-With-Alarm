from core.serializers import RoutineSerializer, TodoSerializer
from .models import Alarm, Routine, Todo
from django.shortcuts import render,HttpResponse, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import json
import datetime



def HomeView(request):
    if request.method == "GET":
        return render(request, 'home.html')

@login_required(login_url="/admin")
def TodoView(request):
    if request.method == "GET":
        todos = request.user.todos.all()
        alarms = Alarm.objects.all()
        context = {'todos':todos,'alarms':alarms}
        return render(request, 'todo.html', context)

@login_required(login_url="/admin")
def RoutineView(request):
    if request.method == "GET":
        routine = request.user.routine.all()
        alarms = Alarm.objects.all()
        context = {'routines':routine,'alarms':alarms}
        return render(request, 'home.html', context)



class HabitApiView(APIView):

    def get(self,request):
        pass
    def put(self,request):
        pass
    def post(self,request):
        pass
        # serializer = RulesSerializer(AllRules,many=True)
        # return Response(serializer.data,status.HTTP_201_CREATED)

class TodoApiView(APIView):

    def get(self,request):
        serializer = TodoSerializer(request.user.todos.all(),many=True)
        return Response(serializer.data,status.HTTP_200_OK)
    def post(self,request):
        data = request.data.dict()
        name = data['name']
        time = data['time']
        priority = data['priority']
        description = data['description']
        # YYYY-MM-DD HH:MM
        # Getting the time like this: 2021-09-23T08:23
        # conveting to this: 2021-09-23 08:23
        time = datetime.datetime.strptime(time.replace('T',' '),'%Y-%m-%d %H:%M')
        print(
            time
        )
        todo = Todo.objects.create(
            user = request.user,
            name = name,
            time = time,
            description = description,
            priority = priority
        )
        todo.save()
        serializer = TodoSerializer(todo)
        return Response(serializer.data,status.HTTP_202_ACCEPTED)

    def put(self,request):
        data = json.loads(request.body)
        todo = get_object_or_404(Todo,id=data['id'])
        if todo.checked:
            todo.checked = False
        else:
            todo.checked = True
        todo.save()
        serializer = TodoSerializer(todo)
        return Response(serializer.data,status.HTTP_200_OK)

    def delete(self,request):
        data = json.loads(request.body)
        todo = get_object_or_404(Todo,id=data['id'])
        todo.delete()
        return Response(status.HTTP_204_NO_CONTENT)

class RoutineApiView(APIView):

    def get(self,request):
        pass
    def post(self,request):
        
        data = request.data.dict()
        name = data['name']
        time = data['time']
        description = data['description']

        time = datetime.datetime.strptime(time.replace('T',' '),'%Y-%m-%d %H:%M')
        routine = Routine.objects.create(
            user = request.user,
            name = name,
            time = time,
            description = description,
        )
        routine.save()
        serializer = RoutineSerializer(routine)
        return Response(serializer.data,status.HTTP_202_ACCEPTED)

    def put(self,request):
        data = json.loads(request.body)
        routine = get_object_or_404(Routine,id=data['id'])
        if routine.checked:
            routine.checked = False
        else:
            routine.checked = True
        routine.save()
        serializer = RoutineSerializer(routine)
        return Response(serializer.data,status.HTTP_200_OK)

    def delete(self,request):
        data = json.loads(request.body)
        routine = get_object_or_404(Routine,id=data['id'])
        routine.delete()
        return Response(status.HTTP_204_NO_CONTENT)
        # serializer = RulesSerializer(AllRules,many=True)
        # return Response(serializer.data,status.HTTP_201_CREATED)
