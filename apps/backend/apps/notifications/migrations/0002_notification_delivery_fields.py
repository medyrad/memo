from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("notifications", "0001_initial")]
    operations = [
        migrations.AddField(model_name="notification", name="error_message", field=models.CharField(blank=True, max_length=500)),
        migrations.AddField(model_name="notification", name="provider_reference", field=models.CharField(blank=True, max_length=160)),
        migrations.AddField(model_name="notification", name="provider_response", field=models.JSONField(blank=True, default=dict)),
        migrations.AddField(model_name="notification", name="recipient", field=models.CharField(blank=True, max_length=80)),
        migrations.AddField(model_name="notification", name="status", field=models.CharField(choices=[("pending", "Pending"), ("sent", "Sent"), ("failed", "Failed"), ("skipped", "Skipped")], default="pending", max_length=20)),
        migrations.AddIndex(model_name="notification", index=models.Index(fields=["channel", "status", "created_at"], name="notificatio_channel_bfbc35_idx")),
    ]
