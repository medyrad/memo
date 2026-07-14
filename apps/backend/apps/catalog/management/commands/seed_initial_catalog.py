from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.catalog.models import Category, Product, ProductAttribute, ProductImage, ProductVariant
from apps.content.models import Banner, HomepageSection, SiteSetting
from apps.inventory.models import Inventory


CATALOG = {
    "necklaces": {
        "title": "گردنبند",
        "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85",
        "items": [
            ("گردنبند قلب مینیمال", "minimal-heart-necklace", 1390000),
            ("گردنبند مروارید اشکی", "pearl-drop-necklace", 1232000),
            ("گردنبند سکه‌ای کلاسیک", "classic-coin-necklace", 890000),
            ("گردنبند ماه و ستاره", "moon-star-necklace", 1190000),
            ("گردنبند پلاک مستطیل", "rectangle-pendant-necklace", 949000),
            ("گردنبند زنجیری ظریف", "delicate-chain-necklace", 690000),
        ],
    },
    "bracelets": {
        "title": "دستبند",
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=85",
        "items": [
            ("دستبند زنجیری کارتیر", "cartier-chain-bracelet", 699000),
            ("دستبند مرواریدی ظریف", "delicate-pearl-bracelet", 740000),
            ("دستبند حلقه‌ای مینیمال", "minimal-bangle-bracelet", 620000),
            ("دستبند شبدر طلایی", "golden-clover-bracelet", 790000),
            ("دستبند بافت استیل", "steel-weave-bracelet", 850000),
            ("دستبند ستاره شمال", "north-star-bracelet", 680000),
        ],
    },
    "gifts": {
        "title": "ست هدیه",
        "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85",
        "items": [
            ("ست هدیه قلب و مروارید", "heart-pearl-gift-set", 2490000),
            ("ست هدیه مینیمال طلایی", "minimal-gold-gift-set", 2190000),
            ("ست هدیه مادر و دختر", "mother-daughter-gift-set", 2890000),
            ("ست هدیه شبدر", "clover-gift-set", 2350000),
            ("ست هدیه ماه و ستاره", "moon-star-gift-set", 2590000),
            ("ست هدیه کلاسیک", "classic-jewelry-gift-set", 2790000),
        ],
    },
    "bags": {
        "title": "کیف",
        "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
        "items": [
            ("کیف دوشی مینی کلاسیک", "classic-mini-shoulder-bag", 1980000),
            ("کیف دستی چرم وگان", "vegan-leather-handbag", 2350000),
            ("کیف کراس‌بادی مینیمال", "minimal-crossbody-bag", 1890000),
            ("کیف مجلسی زنجیردار", "chain-evening-bag", 2150000),
            ("کیف باکت روزمره", "daily-bucket-bag", 2290000),
            ("کیف هدیه ممو", "memo-signature-gift-bag", 1690000),
        ],
    },
}


class Command(BaseCommand):
    help = "Create or update the sellable four-category starter catalog and CMS defaults."

    @transaction.atomic
    def handle(self, *args, **options):
        product_count = 0
        for category_order, (category_slug, category_data) in enumerate(CATALOG.items(), start=1):
            category, _ = Category.objects.update_or_create(
                slug=category_slug,
                defaults={
                    "title": category_data["title"],
                    "description": f"مجموعه منتخب {category_data['title']} ممو استایلز",
                    "is_active": True,
                    "sort_order": category_order,
                },
            )
            for index, (title, slug, price) in enumerate(category_data["items"], start=1):
                product, _ = Product.objects.update_or_create(
                    slug=slug,
                    defaults={
                        "category": category,
                        "title": title,
                        "short_description": f"{title} با طراحی کاربردی، بسته‌بندی شیک و ضمانت کیفیت ممو استایلز.",
                        "long_description": f"{title} برای استفاده روزمره و هدیه طراحی شده است. محصول با کنترل کیفیت، بسته‌بندی اختصاصی و امکان بازگشت طبق قوانین فروشگاه عرضه می‌شود.",
                        "status": Product.Status.ACTIVE,
                        "seo_title": f"خرید {title} | ممو استایلز",
                        "seo_description": f"قیمت و خرید آنلاین {title} با ارسال به سراسر ایران.",
                    },
                )
                sku = f"MS-{category_slug[:3].upper()}-{index:03d}"
                variant, _ = ProductVariant.objects.update_or_create(
                    sku=sku,
                    defaults={
                        "product": product,
                        "color": "طلایی" if category_slug != "bags" else "کرم",
                        "material": "استیل ضدحساسیت" if category_slug in {"necklaces", "bracelets"} else ("چرم وگان" if category_slug == "bags" else "ترکیبی"),
                        "size": "استاندارد",
                        "price": Decimal(price),
                        "compare_at_price": Decimal(price + 190000) if index in {1, 4} else None,
                        "is_active": True,
                    },
                )
                Inventory.objects.update_or_create(
                    variant=variant,
                    defaults={"quantity": 8 + index * 2, "reserved_quantity": 0, "low_stock_threshold": 3},
                )
                ProductImage.objects.update_or_create(
                    product=product,
                    is_primary=True,
                    defaults={
                        "external_url": category_data["image"],
                        "alt_text": title,
                        "sort_order": 0,
                    },
                )
                ProductAttribute.objects.update_or_create(product=product, name="ضمانت", defaults={"value": "ضمانت کیفیت و اصالت"})
                product_count += 1

        Banner.objects.update_or_create(
            title="زیبایی در جزئیات است",
            placement="home-hero",
            defaults={
                "subtitle": "استایل تو، امضای تو",
                "external_url": CATALOG["necklaces"]["image"],
                "link_url": "/categories/necklaces",
                "sort_order": 1,
                "is_active": True,
            },
        )
        HomepageSection.objects.update_or_create(
            key="home-best-sellers",
            defaults={
                "kind": HomepageSection.Kind.PRODUCT_RAIL,
                "title": "پرفروش‌ترین‌ها",
                "subtitle": "انتخاب‌های محبوب مشتریان ممو استایلز",
                "link_text": "مشاهده همه",
                "link_url": "/products",
                "config": {"category_slugs": list(CATALOG), "limit": 8, "ordering": "-created_at"},
                "sort_order": 2,
                "is_active": True,
            },
        )
        SiteSetting.objects.update_or_create(
            key="contact",
            defaults={
                "label": "اطلاعات تماس",
                "value": {"phone": "021-91090909", "email": "info@memostyles.com", "address": "تهران، خیابان ولیعصر، مجتمع تجاری نور"},
                "is_public": True,
            },
        )
        SiteSetting.objects.update_or_create(
            key="footer",
            defaults={
                "label": "تنظیمات فوتر",
                "value": {"description": "اکسسوری و هدیه با طراحی مینیمال و ارسال به سراسر ایران.", "instagram": "https://instagram.com/memostyles", "copyright": "تمامی حقوق برای memostyles محفوظ است."},
                "is_public": True,
            },
        )
        self.stdout.write(self.style.SUCCESS(f"Starter catalog is ready: {product_count} active products."))
