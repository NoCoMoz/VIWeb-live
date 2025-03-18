# Deployment Guide

## GitHub Actions Deployment

This project uses GitHub Actions to automatically deploy the website to your hosting provider via FTP whenever changes are pushed to the main branch.

### Setting Up GitHub Secrets

To enable the GitHub Actions workflow, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click on "New repository secret"
4. Add the following secrets:

   - `FTP_SERVER`: Your FTP server hostname (e.g., `ftp.example.com`)
   - `FTP_USERNAME`: Your FTP username
   - `FTP_PASSWORD`: Your FTP password
   - `FTP_PATH`: The directory path on the FTP server where the files should be uploaded (e.g., `/public_html` or `/www`)

### Manual Deployment

If you prefer to deploy manually, you can use the provided `deploy.sh` script:

1. Open `deploy.sh` and update the FTP credentials:

   ```bash
   FTP_SERVER="your-ftp-server.com"
   FTP_USERNAME="your-username"
   FTP_PASSWORD="your-password"
   FTP_PATH="/path/on/server"
   ```

2. Run the deployment script:

   ```bash
   npm run deploy
   ```

## Environment Variables

The application requires certain environment variables to function properly:

### Production Environment

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=production
PORT=8080  # or your preferred port
```

### BlueSky API Integration

To enable the BlueSky feed, create a `.env.local` file with your BlueSky credentials:

```
BLUESKY_USERNAME=your_bluesky_username
BLUESKY_APP_PASSWORD=your_bluesky_app_password
```

## Troubleshooting

### Deployment Fails

If the GitHub Actions deployment fails, check the following:

1. Verify that all GitHub secrets are correctly set
2. Check the GitHub Actions logs for specific error messages
3. Ensure your FTP server is accessible and the credentials are correct
4. Verify that the FTP user has write permissions to the specified directory

### BlueSky Feed Not Working

If the BlueSky feed is not displaying correctly:

1. Check that your BlueSky credentials are correctly set in the `.env.local` file
2. Verify that the BlueSky API is operational
3. Check the server logs for any API-related errors
4. Ensure the handle specified in the BlueSky feed configuration exists
