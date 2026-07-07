from rest_framework import viewsets

from .models import Banner, BlogPost, Page
from .serializers import BannerSerializer, BlogPostSerializer, PageSerializer


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all().order_by("title")
    serializer_class = PageSerializer
    filterset_fields = ["is_published", "slug"]


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by("-published_at", "-created_at")
    serializer_class = BlogPostSerializer
    filterset_fields = ["is_published", "slug"]
    search_fields = ["title", "excerpt", "body"]


class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    filterset_fields = ["placement", "is_active"]

