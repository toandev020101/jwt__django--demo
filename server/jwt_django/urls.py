from django.urls import re_path

from . import views

urlpatterns = [
    re_path('register', views.register, name='register'),
    re_path('verify-email', views.verify_email, name='verify email'),
    re_path('login', views.login, name='login'),
]
