const fs = require('fs');
const path = require('path');

// Function to update links in HTML files
function updateLinks(filePath) {
    console.log(`Processing ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update absolute paths to include repository name
    content = content.replace(/href=\"\/(Pages\/[^\"]+)\"/g, 'href="/VIWeb-live/$1"');
    content = content.replace(/src=\"\/(images\/[^\"]+)\"/g, 'src="/VIWeb-live/$1"');
    content = content.replace(/src=\"\/(scripts\/[^\"]+)\"/g, 'src="/VIWeb-live/$1"');
    content = content.replace(/href=\"\/(styles\/[^\"]+)\"/g, 'href="/VIWeb-live/$1"');
    
    // Update relative paths for files in Pages directory
    if (filePath.includes('Pages')) {
        content = content.replace(/href=\"\.\.\/(images\/[^\"]+)\"/g, 'href="/VIWeb-live/images/$1"');
        content = content.replace(/src=\"\.\.\/(images\/[^\"]+)\"/g, 'src="/VIWeb-live/images/$1"');
        content = content.replace(/src=\"\.\.\/(scripts\/[^\"]+)\"/g, 'src="/VIWeb-live/scripts/$1"');
        content = content.replace(/href=\"\.\.\/(styles\/[^\"]+)\"/g, 'href="/VIWeb-live/styles/$1"');
        content = content.replace(/href=\"\.\.\/(footer-styles\.css)\"/g, 'href="/VIWeb-live/$1"');
    }
    
    // Fix double images in paths
    content = content.replace(/\/VIWeb-live\/images\/images\//g, '/VIWeb-live/images/');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

// Process all HTML files in the Pages directory
const pagesDir = path.join(__dirname, 'Pages');
fs.readdirSync(pagesDir).forEach(file => {
    if (file.endsWith('.html')) {
        updateLinks(path.join(pagesDir, file));
    }
});

console.log('All links updated successfully!');
