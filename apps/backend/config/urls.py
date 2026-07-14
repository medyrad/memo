from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

from apps.accounts.views import AddressViewSet, CustomerProfileViewSet, PermissionViewSet, RoleViewSet, UserViewSet
from apps.audit.views import AuditLogViewSet
from apps.cart.views import CartItemViewSet, CartViewSet
from apps.catalog.views import CategoryViewSet, ProductImageViewSet, ProductVariantViewSet, ProductViewSet
from apps.content.views import BannerViewSet, BlogPostViewSet, HomepageSectionViewSet, PageViewSet, SiteSettingViewSet
from apps.discounts.views import CouponViewSet, DiscountRuleViewSet
from apps.inventory.views import InventoryViewSet
from apps.notifications.views import NotificationViewSet
from apps.orders.views import OrderItemViewSet, OrderStatusHistoryViewSet, OrderViewSet
from apps.payments.views import PaymentViewSet
from apps.reviews.views import ReviewViewSet, WishlistItemViewSet, WishlistViewSet
from apps.shipping.views import ShipmentViewSet

admin.site.site_header = "مدیریت فروشگاه memostyles"
admin.site.site_title = "memostyles Admin"
admin.site.index_title = "عملیات فروشگاه"

router = DefaultRouter()
router.register("users", UserViewSet)
router.register("roles", RoleViewSet)
router.register("permissions", PermissionViewSet)
router.register("profiles", CustomerProfileViewSet)
router.register("addresses", AddressViewSet)
router.register("categories", CategoryViewSet)
router.register("products", ProductViewSet)
router.register("product-variants", ProductVariantViewSet)
router.register("product-images", ProductImageViewSet)
router.register("inventory", InventoryViewSet)
router.register("cart", CartViewSet)
router.register("cart-items", CartItemViewSet)
router.register("orders", OrderViewSet)
router.register("order-items", OrderItemViewSet)
router.register("order-status-history", OrderStatusHistoryViewSet)
router.register("payments", PaymentViewSet)
router.register("shipments", ShipmentViewSet)
router.register("coupons", CouponViewSet)
router.register("discount-rules", DiscountRuleViewSet)
router.register("wishlist", WishlistViewSet)
router.register("wishlist-items", WishlistItemViewSet)
router.register("reviews", ReviewViewSet)
router.register("blog-posts", BlogPostViewSet)
router.register("pages", PageViewSet)
router.register("banners", BannerViewSet)
router.register("homepage-sections", HomepageSectionViewSet)
router.register("site-settings", SiteSettingViewSet)
router.register("notifications", NotificationViewSet)
router.register("audit-logs", AuditLogViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
