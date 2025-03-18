# Voices Ignited Website Documentation

## Overview

Welcome to the documentation for the Voices Ignited website. This documentation provides comprehensive information about the website's architecture, configuration, and usage.

## Table of Contents

### Setup and Configuration

- [Server Configuration](./server-configuration.md) - How to configure the server for different environments
- [Deployment Guide](./deployment.md) - How to deploy the website to a production server
- [Namecheap cPanel Deployment](./namecheap-cpanel-deployment.md) - How to deploy to Namecheap cPanel hosting
- [GitHub Actions Workflow](./github-actions.md) - How to use GitHub Actions for automated deployment

### Features and Integrations

- [BlueSky Integration](./bluesky-integration.md) - How to set up and customize the BlueSky social media feed

## Quick Start

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/VIWeb-live.git
   cd VIWeb-live
   ```

2. Run the setup script
   ```bash
   npm run setup
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── .github/workflows/     # GitHub Actions workflow files
├── api/                   # API endpoints
│   └── bluesky/           # BlueSky API integration
├── docs/                  # Documentation files
├── images/                # Image assets
├── models/                # Data models
├── Pages/                 # HTML pages
├── scripts/               # Client-side JavaScript
│   └── bluesky-feed.js    # BlueSky feed component
├── styles/                # CSS stylesheets
├── test/                  # Test files
├── .env                   # Environment variables (production)
├── .env.local             # Local environment variables (not in git)
├── deploy.sh              # Deployment script
├── package.json           # Project dependencies and scripts
├── README.md              # Project overview
├── server-setup.sh        # Server setup script
└── server.js              # Main server file
```

## Deployment Options

1. **Automated Deployment via GitHub Actions**
   - Push to main/master branch
   - GitHub Actions will run tests
   - If tests pass, code is deployed to Namecheap cPanel

2. **Manual Deployment**
   - Use FTP client to upload files
   - Use cPanel File Manager
   - Run deployment script locally

## Contributing

If you'd like to contribute to the documentation, please follow these guidelines:

1. Use Markdown for all documentation files
2. Keep the documentation up-to-date with code changes
3. Use clear, concise language
4. Include examples where appropriate

## Support

If you encounter any issues or have questions about the website, please contact the Voices Ignited team.
