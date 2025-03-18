# Voices Ignited Website

This repository contains the source code for the Voices Ignited website, a platform dedicated to fighting corruption and greed in government.

## Features

- Responsive design for all devices
- BlueSky social media integration
- Events management
- Support and donation options
- Community engagement tools

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/VIWeb-live.git
   cd VIWeb-live
   ```

2. Run the setup script
   ```bash
   npm run setup
   ```
   This will install dependencies and create the necessary environment files.

3. Update the `.env.local` file with your BlueSky credentials
   ```
   BLUESKY_USERNAME=your_bluesky_username
   BLUESKY_APP_PASSWORD=your_bluesky_app_password
   ```

### Running the Application

1. Start the development server
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Deployment

1. Configure your deployment settings in `deploy.sh`
   - Update the FTP host, username, password, and directory

2. Deploy to production
   ```bash
   npm run deploy
   ```

## Project Structure

- `/Pages` - HTML pages for the website
- `/api` - API endpoints
- `/scripts` - Client-side JavaScript
- `/styles` - CSS stylesheets
- `/images` - Image assets
- `/models` - Data models

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the volunteers and supporters of Voices Ignited
- The BlueSky team for their API
- Bootstrap for the responsive framework
