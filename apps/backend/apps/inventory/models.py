from django.db import models

from apps.common import TimeStampedModel


class Inventory(TimeStampedModel):
    variant = models.OneToOneField("catalog.ProductVariant", on_delete=models.CASCADE, related_name="inventory")
    quantity = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=3)

    class Meta:
        verbose_name_plural = "inventory"
        constraints = [
            models.CheckConstraint(check=models.Q(reserved_quantity__lte=models.F("quantity")), name="reserved_inventory_lte_quantity"),
        ]

    @property
    def is_low_stock(self) -> bool:
        return self.available_quantity <= self.low_stock_threshold

    @property
    def available_quantity(self) -> int:
        return max(0, self.quantity - self.reserved_quantity)

    def __str__(self) -> str:
        return f"{self.variant_id}: {self.quantity}"
