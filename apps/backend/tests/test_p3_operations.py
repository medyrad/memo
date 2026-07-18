import pytest
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.notifications.models import Notification
from apps.notifications.services import normalize_iran_mobile, send_sms_notification


def test_iran_mobile_normalization_accepts_persian_and_country_code():
    assert normalize_iran_mobile("+۹۸ ۹۱۲ ۰۰۰ ۰۰۰۱") == "09120000001"
    assert normalize_iran_mobile("0098-912-000-0001") == "09120000001"


@pytest.mark.django_db
def test_sms_delivery_is_audited(monkeypatch, settings):
    user = User.objects.create_user(username="sms-user", phone="09120000002")
    settings.SMS_ENABLED = True
    settings.KAVENEGAR_API_KEY = "test-key"
    monkeypatch.setattr("apps.notifications.services._send_kavenegar", lambda phone, body: ("12345", {"entries": [{"messageid": 12345}]}))

    notification = send_sms_notification(user=user, phone=user.phone, subject="ثبت سفارش", body="پیام تست")

    assert notification.status == Notification.Status.SENT
    assert notification.provider_reference == "12345"
    assert notification.sent_at is not None


@pytest.mark.django_db
def test_health_endpoints_distinguish_liveness_and_readiness():
    client = APIClient()
    assert client.get("/health/live/").status_code == 200
    response = client.get("/health/ready/")
    assert response.status_code == 200
    assert response.json()["database"] == "up"
