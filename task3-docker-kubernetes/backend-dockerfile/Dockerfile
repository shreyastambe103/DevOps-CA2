# Use official Python image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/ /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
