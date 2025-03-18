const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

const config = {
    user: "Tech@voicesignited.org",
    password: process.env.FTP_PASSWORD,
    host: "162.0.232.112",
    port: 21,
    localRoot: __dirname,
    remoteRoot: "/home/voicylda/public_html/",
    include: ["*", "**/*"],
    exclude: [
        "**/.git/**",
        "**/.git*",
        "**/node_modules/**",
        "**/.env*",
        "test-deploy.js"
    ],
    deleteRemote: false,
    forcePasv: true,
    debugMode: true
};

ftpDeploy.on("uploading", function(data) {
    console.log(`Uploading: ${data.filename}`);
});

ftpDeploy.on("uploaded", function(data) {
    console.log(`Uploaded: ${data.filename}`);
});

ftpDeploy.on("log", function(data) {
    console.log(data);
});

ftpDeploy.on("error", function(err) {
    console.log("Error:", err);
});

console.log("Starting FTP deployment...");
console.log("Config:", { ...config, password: '***' });

ftpDeploy.deploy(config)
    .then(res => console.log("Finished uploading"))
    .catch(err => console.log("Error:", err));
