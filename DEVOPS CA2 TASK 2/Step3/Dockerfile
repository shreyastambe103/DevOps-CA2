# Use a slim official Python image. This is the base of your environment.
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
ENV PORT 5000

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the requirements file first. This allows Docker to cache the dependency installation.
# The requirements.txt file in the project includes complex dependencies like opencv-python-headless
COPY requirements.txt ./

# Install the Python dependencies
# We use 'no-cache-dir' to keep the image size smaller
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the application will listen on
EXPOSE 5000

# The command to run the application
# We use gunicorn for production-grade serving (better than 'python app.py')
# If gunicorn is not in your requirements.txt, use CMD ["python", "app.py"]
# Otherwise, install gunicorn and use this:
CMD ["python", "app.py"]