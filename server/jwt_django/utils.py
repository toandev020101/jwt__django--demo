import random
from django.core.mail import EmailMessage

from django.conf import settings
from .models import User, OTP


def generate_otp():
    otp = ""
    for i in range(6):
        otp += str(random.randint(1, 9))

    return otp

def send_code_to_email(email):
    subject = "Mã xác minh email của JWT_Django"
    code = generate_otp()
    user = User.objects.get(email=email)
    current_site = "http://localhost:3000"
    email_body = f"Xin chào {user.first_name}, cảm ơn bạn đã đăng ký trên {current_site}, vui lòng nhập mã để xác minh email: {code}"
    from_email = settings.DEFAULT_FROM_EMAIL

    OTP.objects.create(user=user, code=code)
    send_email = EmailMessage(subject=subject, body=email_body, from_email=from_email, to=[email])
    send_email.send(fail_silently=True)

