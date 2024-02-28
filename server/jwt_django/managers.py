from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(_({'email': 'Vui lòng nhập email!'}))

    def create_user(self, email, password, first_name, last_name, **extra_fields):
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_({'email': 'Vui lòng nhập email!'}))

        if not first_name:
            raise ValueError(_({'first_name': 'Vui lòng nhập tên!'}))

        if not last_name:
            raise ValueError(_({'last_name': 'Vui lòng nhập họ!'}))

        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, first_name, last_name, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Người dùng phải là nhân viên quản trị!'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Người dùng phải là siêu người dùng!'))

        user = self.create_user(email=email, password=password, first_name=first_name, last_name=last_name, **extra_fields)
        user.save(using=self._db)
        return user
