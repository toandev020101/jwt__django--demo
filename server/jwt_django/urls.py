from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path('auth/register', views.register, name='register'),
    path('auth/verify-email', views.verify_email, name='verify-email'),
    path('auth/login', views.login, name='login'),
    path('auth/reset-password', views.reset_password, name='reset-password'),
    path('auth/reset-password-confirm/<str:uidb64>/<str:token>', views.reset_password_confirm,
         name='reset-password-confirm'),
    path('auth/set-new-password', views.set_new_password, name='set-new-password'),
    path('auth/logout', views.logout, name='logout'),
    path('auth/refresh-token', TokenRefreshView.as_view(), name='refresh-token'),
    path('users/<int:id>', views.get_one_user_by_id, name='get-one-user-by-id'),
    path('users/set-one/<int:id>', views.update_one_user, name='update-one-user'),
]
