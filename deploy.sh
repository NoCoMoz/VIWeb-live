#!/bin/bash

# Deployment script for VIWeb-live
# This script pulls the latest changes from GitHub and deploys them to the server

# Change to the public_html directory
cd /home/voicylda/public_html

# Check if the repository exists
if [ -d ".git" ]; then
    echo "Git repository exists, pulling latest changes..."
    git pull
else
    echo "Git repository doesn't exist, cloning..."
    # Replace with your actual GitHub repository URL
    git clone https://github.com/YOUR_USERNAME/VIWeb-live.git .
    # If your repository is private, you might need to use SSH:
    # git clone git@github.com:YOUR_USERNAME/VIWeb-live.git .
fi

echo "Deployment completed successfully!"
