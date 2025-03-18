#!/bin/bash

# Voices Ignited Website Server Setup Script
# This script sets up the necessary environment for the Voices Ignited website

# Exit on error
set -e

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  cat > .env.local << EOL
# BlueSky API credentials
BLUESKY_USERNAME=your_bluesky_username
BLUESKY_APP_PASSWORD=your_bluesky_app_password

# Server configuration
PORT=3000
NODE_ENV=development
EOL
  echo ".env.local file created. Please update with your actual credentials."
else
  echo ".env.local file already exists."
fi

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
  echo "Creating data directory..."
  mkdir -p data
fi

echo "Server setup completed successfully!"
echo "To start the server, run: npm start"
