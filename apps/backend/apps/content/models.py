from django.db import models

from apps.common import TimeStampedModel


class Page(TimeStampedModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, allow_unicode=True)
    body = models.TextField()
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    is_published = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.title


class BlogPost(TimeStampedModel):
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True, allow_unicode=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField()
    cover_image = models.FileField(upload_to="blog/", null=True, blank=True)
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["slug"]), models.Index(fields=["is_published", "published_at"])]

    def __str__(self) -> str:
        return self.title


class Banner(TimeStampedModel):
    title = models.CharField(max_length=160)
    subtitle = models.CharField(max_length=220, blank=True)
    image = models.FileField(upload_to="banners/", null=True, blank=True)
    external_url = models.CharField(max_length=600, blank=True)
    link_url = models.CharField(max_length=255, blank=True)
    placement = models.CharField(max_length=80, default="home")
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["placement", "sort_order"]

    def __str__(self) -> str:
        return self.title


class HomepageSection(TimeStampedModel):
    class Kind(models.TextChoices):
        HERO = "hero", "Hero"
        PRODUCT_RAIL = "product_rail", "Product rail"
        CATEGORY_GRID = "category_grid", "Category grid"
        PROMO = "promo", "Promotion"
        INSTAGRAM = "instagram", "Instagram"

    key = models.SlugField(max_length=100, unique=True)
    kind = models.CharField(max_length=30, choices=Kind.choices)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=320, blank=True)
    image = models.FileField(upload_to="homepage/", null=True, blank=True)
    external_url = models.CharField(max_length=600, blank=True)
    link_text = models.CharField(max_length=100, blank=True)
    link_url = models.CharField(max_length=255, blank=True)
    config = models.JSONField(default=dict, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "created_at"]

    def __str__(self) -> str:
        return self.title


class SiteSetting(TimeStampedModel):
    key = models.SlugField(max_length=120, unique=True)
    label = models.CharField(max_length=180)
    value = models.JSONField(default=dict, blank=True)
    is_public = models.BooleanField(default=True)

    class Meta:
        ordering = ["key"]

    def __str__(self) -> str:
        return self.label
