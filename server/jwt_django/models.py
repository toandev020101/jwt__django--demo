from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken

from .managers import UserManager


# Create your models here.


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True, verbose_name=_("Email"))
    first_name = models.CharField(max_length=100, verbose_name=_("First Name"))
    last_name = models.CharField(max_length=100, verbose_name=_("Last Name"))

    gender = models.CharField(max_length=5, null=True, verbose_name=_("Gender"))
    phone_number = models.CharField(max_length=11, null=True, verbose_name=_("Phone Number"))
    avatar = models.ImageField(upload_to='uploads/%Y/%m/', null=True, blank=True, verbose_name=_("Avatar"))

    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    def __str__(self):
        return self.email

    @property
    def get_full_name(self):
        return f"{self.last_name} {self.first_name}"

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }


class OTP(models.Model):
    code = models.CharField(max_length=6, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.code
