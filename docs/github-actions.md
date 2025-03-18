# GitHub Actions Workflow Guide

## Overview

This project uses GitHub Actions to automate the deployment process. The workflow is defined in the `.github/workflows/ftp-deploy.yml` file and is triggered whenever changes are pushed to the `main` or `master` branch.

## Workflow Configuration

The workflow performs the following steps:

1. **Test Phase**:
   - Checks out the code from the repository
   - Sets up Node.js
   - Installs dependencies
   - Creates a test environment file
   - Runs linting checks
   - Starts the server in the background
   - Runs tests

2. **Deploy Phase**:
   - Checks out the code from the repository
   - Sets up Node.js
   - Installs dependencies
   - Creates a production environment file
   - Deploys the code to the FTP server
   - Notifies of deployment success

3. **Notification Phase**:
   - Checks the deployment status
   - Reports success or failure

## Required Secrets

To use this workflow, you need to set up the following secrets in your GitHub repository:

| Secret Name | Description |
|-------------|-------------|
| `FTP_SERVER` | The hostname of your FTP server (e.g., `ftp.example.com`) |
| `FTP_USERNAME` | Your FTP username |
| `FTP_PASSWORD` | Your FTP password |
| `FTP_PATH` | The directory on the FTP server where files should be deployed (e.g., `/public_html`) |

### Setting Up Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click on "New repository secret"
4. Add each of the secrets listed above

## GitHub Templates

This repository includes several GitHub templates to standardize issue reporting and pull requests:

### Issue Templates

1. **Bug Report Template** (`.github/ISSUE_TEMPLATE/bug_report.md`):
   - Provides a structured format for reporting bugs
   - Includes sections for bug description, steps to reproduce, expected behavior, screenshots, and environment details

2. **Feature Request Template** (`.github/ISSUE_TEMPLATE/feature_request.md`):
   - Provides a structured format for requesting new features
   - Includes sections for problem description, proposed solution, alternatives considered, and additional context

### Pull Request Template

The Pull Request template (`.github/pull_request_template.md`) provides a standardized format for submitting pull requests, including:

- Description of changes
- Type of change (bug fix, new feature, etc.)
- Testing information
- Checklist of completed items

## Customizing the Workflow

### Changing the Trigger Events

By default, the workflow runs when changes are pushed to the `main` or `master` branch. You can modify this by changing the `on` section of the workflow file:

```yaml
on:
  push:
    branches: [ main, develop ]  # Change this to your preferred branches
  workflow_dispatch:  # Allows manual triggering
```

### Excluding Files from Deployment

You can exclude files from being deployed by modifying the `exclude` section of the FTP Deploy action:

```yaml
exclude: |
  **/.git*
  **/.git*/**
  **/node_modules/**
  **/.env*
  **/.github/**
  **/test/**
  deploy.sh
  server-setup.sh
  **/*.log
  **/*.md
  **/docs/**
  # Add your exclusions here
```

### Changing the Node.js Version

To use a different Node.js version, modify the `node-version` parameter in the "Setup Node.js" step:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '16'  # Change to your preferred version
    cache: 'npm'
```

## Troubleshooting

### Workflow Fails with Authentication Error

If the workflow fails with an authentication error, check that your FTP credentials are correctly set in the GitHub secrets.

### Workflow Fails with "No such file or directory"

If the workflow fails with a "No such file or directory" error, check that the `FTP_PATH` secret is correctly set and that the directory exists on the FTP server.

### Workflow Runs Successfully but Website Not Updated

If the workflow runs successfully but the website is not updated, check:

1. That the `FTP_PATH` points to the correct directory
2. That the FTP user has write permissions to the directory
3. That the files are not being excluded by the `exclude` section

## Advanced Configuration

### Adding Environment Variables

You can add additional environment variables to the workflow by modifying the environment variables in specific steps:

```yaml
- name: Start server in background
  run: node server.js &
  env:
    PORT: 3000
    MY_CUSTOM_VAR: "custom value"
```

### Adding Custom Build Steps

You can add custom build steps before the deployment by adding new steps to the workflow:

```yaml
- name: Build project
  run: npm run build

- name: Run tests
  run: npm test
