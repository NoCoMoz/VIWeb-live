#!/bin/bash

# Voices Ignited Website Deployment Script
# This script deploys the Voices Ignited website to a production server

# Exit on error
set -e

# Configuration
FTP_HOST="your-ftp-host.com"
FTP_USER="your-ftp-username"
FTP_PASS="your-ftp-password"
FTP_DIR="/public_html"

# Build process
echo "Installing dependencies..."
npm install --production

# Create production .env file
echo "Creating production environment file..."
cat > .env << EOL
NODE_ENV=production
PORT=8080
EOL

# Files to exclude from deployment
cat > .ftpignore << EOL
.git/
.github/
node_modules/
.env.local
.ftpignore
deploy.sh
server-setup.sh
*.log
EOL

echo "Deploying to production server..."

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "Error: lftp is not installed. Please install it first."
    exit 1
fi

# Deploy using lftp (more reliable than ftp)
lftp -c "open -u $FTP_USER,$FTP_PASS $FTP_HOST; \
  mirror -R --delete --verbose \
  --exclude-glob .git/ \
  --exclude-glob .github/ \
  --exclude-glob node_modules/ \
  --exclude-glob .env.local \
  --exclude-glob .ftpignore \
  --exclude-glob deploy.sh \
  --exclude-glob server-setup.sh \
  --exclude-glob *.log \
  ./ $FTP_DIR"

echo "Deployment completed successfully!"
