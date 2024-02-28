from django.contrib import admin
from django.contrib.auth.models import Permission

from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'last_name', 'first_name', 'is_verified', 'is_active', 'date_joined']
    search_fields = ['email', 'first_name']
    list_filter = ['is_verified', 'is_active']


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Permission)