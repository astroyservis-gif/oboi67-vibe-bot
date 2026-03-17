#!/bin/bash
# Deployment script for Yuri's Wallpaper bot & website on a minimalist VPS (1GB RAM)

set -e

echo "Starting deployment..."

# 1. Update system & install Node.js + Python 3
echo "Installing dependencies..."
sudo apt update && sudo apt install -y curl dirmngr apt-transport-https lsb-release ca-certificates python3-venv python3-pip nginx

# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Build Frontend
echo "Building React static frontend..."
cd web
npm install
npm run build
cd ..

# 3. Setup Nginx for Frontend and API Proxying
echo "Configuring Nginx..."
sudo cat > /etc/nginx/sites-available/bot-web << 'EOF'
server {
    listen 80;
    server_name _; # Change to domain if available

    # Serve React Static export
    root /var/www/bot-web/web/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Proxy API calls to the Python backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/bot-web /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

# 4. Setup Python Bot Backend Service
echo "Setting up Python backend..."
cd bot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service for Bot
sudo cat > /etc/systemd/system/yuri-bot.service << 'EOF'
[Unit]
Description=Yuri Wallpaper Telegram Bot & API
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/bot-web/bot
ExecStart=/var/www/bot-web/bot/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable yuri-bot
sudo systemctl restart yuri-bot

echo "Deployment finished successfully. Site and bot are running!"
