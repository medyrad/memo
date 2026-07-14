import json
from dataclasses import dataclass
from decimal import Decimal
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings


class GatewayError(RuntimeError):
    pass


@dataclass(frozen=True)
class GatewayRequestResult:
    authority: str
    payment_url: str
    raw_response: dict


@dataclass(frozen=True)
class GatewayVerifyResult:
    reference_id: str
    raw_response: dict


class ZarinpalGateway:
    def __init__(self) -> None:
        if not settings.ZARINPAL_MERCHANT_ID:
            raise GatewayError("شناسه پذیرنده زرین‌پال تنظیم نشده است.")

    @staticmethod
    def _post(url: str, payload: dict) -> dict:
        request = Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urlopen(request, timeout=15) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise GatewayError(f"پاسخ نامعتبر درگاه: {body[:300]}") from exc
        except (URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise GatewayError("ارتباط امن با درگاه پرداخت برقرار نشد.") from exc

    @staticmethod
    def _gateway_amount(amount: Decimal) -> int:
        return int(amount * settings.PAYMENT_AMOUNT_MULTIPLIER)

    def request(self, *, amount: Decimal, description: str, mobile: str = "", email: str = "") -> GatewayRequestResult:
        payload = {
            "merchant_id": settings.ZARINPAL_MERCHANT_ID,
            "amount": self._gateway_amount(amount),
            "callback_url": settings.PAYMENT_CALLBACK_URL,
            "description": description,
            "metadata": {key: value for key, value in {"mobile": mobile, "email": email}.items() if value},
        }
        response = self._post(settings.ZARINPAL_REQUEST_URL, payload)
        data = response.get("data") or {}
        if data.get("code") != 100 or not data.get("authority"):
            raise GatewayError(data.get("message") or "درگاه درخواست پرداخت را نپذیرفت.")
        authority = data["authority"]
        return GatewayRequestResult(
            authority=authority,
            payment_url=settings.ZARINPAL_GATEWAY_URL.format(authority=authority),
            raw_response=response,
        )

    def verify(self, *, amount: Decimal, authority: str) -> GatewayVerifyResult:
        response = self._post(
            settings.ZARINPAL_VERIFY_URL,
            {
                "merchant_id": settings.ZARINPAL_MERCHANT_ID,
                "amount": self._gateway_amount(amount),
                "authority": authority,
            },
        )
        data = response.get("data") or {}
        if data.get("code") not in [100, 101] or not data.get("ref_id"):
            raise GatewayError(data.get("message") or "تایید پرداخت توسط درگاه انجام نشد.")
        return GatewayVerifyResult(reference_id=str(data["ref_id"]), raw_response=response)
