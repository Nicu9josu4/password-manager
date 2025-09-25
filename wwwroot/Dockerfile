# Dockerfile for ProiectDeAn_Code_ACS
FROM python:3.13-slim

# Set workdir
WORKDIR /app

# Copy all project files
COPY . /app

# Install Python dependencies
RUN pip install websockets

# Expose ports: 5000 (HTTP), 8765 (WebSocket)
EXPOSE 5000 8765

# Start both servers (HTTP and WebSocket) using a process manager
CMD ["sh", "-c", "python http_server.py & python ws_server.py"]
