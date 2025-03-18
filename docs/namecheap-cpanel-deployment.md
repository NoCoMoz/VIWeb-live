# Namecheap cPanel Deployment Guide

This guide explains how to set up automatic deployment from GitHub to your Namecheap cPanel hosting account.

## Prerequisites

1. A Namecheap hosting account with cPanel access
2. A GitHub repository with your website code
3. FTP credentials from your cPanel account

## Getting Your cPanel FTP Credentials

1. Log in to your Namecheap cPanel account
2. In the "Files" section, click on "FTP Accounts"
3. Note down the following information:
   - FTP Hostname (usually `ftp.yourdomain.com`)
   - FTP Username (usually your cPanel username)
   - FTP Password

## Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click on "New repository secret"
4. Add the following secrets:
   - `CPANEL_FTP_HOSTNAME`: Your FTP hostname (e.g., `ftp.yourdomain.com`)
   - `CPANEL_FTP_USERNAME`: Your FTP username
   - `CPANEL_FTP_PASSWORD`: Your FTP password

## How the Deployment Works

1. When you push changes to the `main` or `master` branch:
   - GitHub Actions runs the test suite
   - If tests pass, it prepares the files for deployment
   - Files are uploaded to your cPanel's `public_html` directory via FTP

2. The workflow excludes unnecessary files:
   - Git files (`.git`, `.gitignore`)
   - Development files (`node_modules`, test files)
   - Environment files (`.env`, `.env.local`)
   - Documentation files (`*.md`, `docs/`)

## Troubleshooting

### Deployment Fails with FTP Error

If you see FTP connection errors:
1. Verify your FTP credentials in GitHub secrets
2. Check if your hosting server allows FTP connections
3. Try using the full FTP address with your domain

### Files Not Appearing on Website

If files are not showing up after deployment:
1. Check the `public_html` directory in cPanel File Manager
2. Verify file permissions (should be 644 for files, 755 for directories)
3. Clear your browser cache

### Node.js Application Setup

If you're running a Node.js application:
1. Set up Node.js in cPanel (if supported by your hosting plan)
2. Configure the application to run on the correct port
3. Set up any required environment variables in cPanel

## Best Practices

1. **Testing**:
   - Always run tests locally before pushing
   - The workflow includes automated testing
   - Failed tests will prevent deployment

2. **Environment Variables**:
   - Keep sensitive data in GitHub secrets
   - Use different variables for development and production
   - Never commit environment files

3. **File Management**:
   - Regularly clean up old files
   - Keep track of file permissions
   - Back up your data regularly

## Manual Deployment

If you need to deploy manually:

1. Using cPanel File Manager:
   - Log in to cPanel
   - Open File Manager
   - Navigate to `public_html`
   - Upload your files

2. Using FTP Client:
   ```bash
   # Example using FTP command line
   ftp ftp.yourdomain.com
   # Enter your username and password
   cd public_html
   put -r * .
   ```

## Support

If you encounter issues:
1. Check the GitHub Actions logs for error messages
2. Contact Namecheap support if it's a hosting issue
3. Review the deployment workflow configuration
4. Verify your FTP credentials and permissions
