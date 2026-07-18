import multiprocessing
import os

bind = "0.0.0.0:8000"
worker_class = "uvicorn_worker.UvicornWorker"
workers = int(os.getenv("WEB_CONCURRENCY", str(max(2, multiprocessing.cpu_count()))))
timeout = int(os.getenv("GUNICORN_TIMEOUT", "60"))
graceful_timeout = 30
keepalive = 5
max_requests = 1000
max_requests_jitter = 100
accesslog = "-"
errorlog = "-"
capture_output = True
