import json
import logging
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings
from django.utils import timezone

from apps.orders.models import Order

from .models import Notification

logger = logging.getLogger(__name__)
PERSIAN_DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
STATUS_LABELS = {
    Order.Status.PENDING_PAYMENT: "در انتظار پرداخت", Order.Status.PAID: "پرداخت‌شده",
    Order.Status.PROCESSING: "در حال آماده‌سازی", Order.Status.SHIPPED: "ارسال‌شده",
    Order.Status.DELIVERED: "تحویل‌شده", Order.Status.CANCELLED: "لغوشده", Order.Status.REFUNDED: "بازپرداخت‌شده",
}


def normalize_iran_mobile(value: str) -> str:
    phone = "".join(character for character in value.translate(PERSIAN_DIGITS) if character.isdigit() or character == "+")
    if phone.startswith("+98"): return "0" + phone[3:]
    if phone.startswith("0098"): return "0" + phone[4:]
    if phone.startswith("98") and len(phone) == 12: return "0" + phone[2:]
    return phone


def _send_kavenegar(phone: str, message: str) -> tuple[str, dict]:
    api_key = settings.KAVENEGAR_API_KEY
    endpoint = f"https://api.kavenegar.com/v1/{api_key}/sms/send.json"
    request = Request(endpoint, data=urlencode({"receptor": phone, "message": message}).encode(), method="POST")
    with urlopen(request, timeout=settings.SMS_TIMEOUT_SECONDS) as response:  # noqa: S310 - configured trusted provider
        payload = json.loads(response.read().decode("utf-8"))
    entries = payload.get("entries") or []
    reference = str(entries[0].get("messageid", "")) if entries else ""
    return reference, payload


def send_sms_notification(*, user, phone: str, subject: str, body: str) -> Notification:
    phone = normalize_iran_mobile(phone)
    notification = Notification.objects.create(user=user, channel=Notification.Channel.SMS, subject=subject, body=body, recipient=phone)
    if len(phone) != 11 or not phone.startswith("09") or not phone.isdigit():
        notification.status = Notification.Status.FAILED
        notification.error_message = "Recipient is not a valid Iranian mobile number."
        notification.save(update_fields=["status", "error_message", "updated_at"])
        return notification
    if not settings.SMS_ENABLED or not settings.KAVENEGAR_API_KEY:
        notification.status = Notification.Status.SKIPPED
        notification.error_message = "SMS provider is disabled or not configured."
        notification.save(update_fields=["status", "error_message", "updated_at"])
        return notification
    try:
        reference, response = _send_kavenegar(phone, body)
        notification.status = Notification.Status.SENT
        notification.provider_reference = reference
        notification.provider_response = response
        notification.sent_at = timezone.now()
        notification.save(update_fields=["status", "provider_reference", "provider_response", "sent_at", "updated_at"])
    except Exception as exc:  # Provider failure must never roll back commerce state.
        logger.exception("SMS delivery failed for notification %s", notification.pk)
        notification.status = Notification.Status.FAILED
        notification.error_message = str(exc)[:500]
        notification.save(update_fields=["status", "error_message", "updated_at"])
    return notification


def send_order_created_sms(order_id) -> Notification:
    order = Order.objects.select_related("user").get(pk=order_id)
    phone = str(order.shipping_address.get("phone") or order.user.phone or "")
    return send_sms_notification(user=order.user, phone=phone, subject="ثبت سفارش", body=f"سفارش {str(order.id)[:8]} در memostyles ثبت شد و در انتظار پرداخت است.")


def send_order_status_sms(order_id) -> Notification:
    order = Order.objects.select_related("user").get(pk=order_id)
    phone = str(order.shipping_address.get("phone") or order.user.phone or "")
    label = STATUS_LABELS.get(order.status, order.status)
    return send_sms_notification(user=order.user, phone=phone, subject="تغییر وضعیت سفارش", body=f"وضعیت سفارش {str(order.id)[:8]}: {label}")
