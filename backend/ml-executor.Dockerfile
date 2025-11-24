# Start from a Python image that is ready for data science.
FROM python:3.10-slim

# Install basic system dependencies required by some scientific packages
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install core ML/Data Science packages
RUN pip install --no-cache-dir \
    numpy \
    pandas \
    scipy \
    scikit-learn

# For deeper learning models (optional but highly recommended):
# RUN pip install --no-cache-dir \
#     tensorflow  # Or 'torch' if you prefer PyTorch

WORKDIR /code