# Generated by Django 3.2 on 2021-09-25 05:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_alarm'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='timed',
            field=models.BooleanField(default=False),
        ),
    ]
