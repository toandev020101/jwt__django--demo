import random
from django.core.mail import EmailMessage

from django.conf import settings
from .models import User, OTP


def generate_otp():
    otp = ""
    for i in range(6):
        otp += str(random.randint(1, 9))

    return otp


def send_mail(data, type):
    fail_silently = False

    if type == "code":
        fail_silently = True

    if type == "normal":
        fail_silently = False

    handle_send = EmailMessage(
        subject=data['subject'], body=data['body'], from_email=settings.DEFAULT_FROM_EMAIL,
        to=[data['to']]
    )
    handle_send.content_subtype = "html"
    handle_send.send(fail_silently=fail_silently)
