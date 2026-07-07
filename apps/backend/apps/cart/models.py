from django.conf import settings
from django.db import models

from apps.common import TimeStampedModel


class Cart(TimeStampedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="cart")
    session_key = models.CharField(max_length=80, blank=True)

    def __str__(self) -> str:
        return str(self.user_id or self.session_key or self.id)


class CartItem(TimeStampedModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey("catalog.ProductVariant", on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ["cart", "variant"]

    def __str__(self) -> str:
        return f"{self.variant_id} x {self.quantity}"

