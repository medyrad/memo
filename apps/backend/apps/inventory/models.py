from django.db import models

from apps.common import TimeStampedModel


class Inventory(TimeStampedModel):
    variant = models.OneToOneField("catalog.ProductVariant", on_delete=models.CASCADE, related_name="inventory")
    quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=3)

    class Meta:
        verbose_name_plural = "inventory"

    @property
    def is_low_stock(self) -> bool:
        return self.quantity <= self.low_stock_threshold

    def __str__(self) -> str:
        return f"{self.variant_id}: {self.quantity}"

