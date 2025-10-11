# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy rest of the project
COPY . .

# Expose Django port
EXPOSE 8000

# Optional: run migrations (can also do in CI/CD)
# RUN python manage.py migrate

# Start Django with Gunicorn
CMD ["gunicorn", "wealthwise.wsgi:application", "--bind", "0.0.0.0:8000", "--workers=3"]