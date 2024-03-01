from django.urls import path

from . import views

urlpatterns = [
    path('register', views.register, name='register'),
    path('verify-email', views.verify_email, name='verify-email'),
    path('login', views.login, name='login'),
    path('reset-password', views.reset_password, name='reset-password'),
    path('reset-password-confirm/<str:uidb64>/<str:token>', views.reset_password_confirm,
         name='reset-password-confirm'),
    path('set-new-password', views.set_new_password, name='set-new-password'),
    path('logout', views.logout, name='logout'),
]
