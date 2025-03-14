# Generated by Django 5.1.2 on 2024-10-16 02:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_alter_profile_birthdate"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, verbose_name="Created at"),
        ),
        migrations.AlterField(
            model_name="profile",
            name="last_modified",
            field=models.DateTimeField(auto_now=True, verbose_name="Last modified"),
        ),
    ]
