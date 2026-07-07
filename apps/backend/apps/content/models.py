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
    link_url = models.CharField(max_length=255, blank=True)
    placement = models.CharField(max_length=80, default="home")
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["placement", "sort_order"]
