const ftp = require('basic-ftp');
const fs = require('fs');

async function testFTPConnection() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    
    try {
        await client.access({
            host: "ftp.voicesignited.org",
            user: "Tech@voicesignited.org",
            password: process.env.FTP_PASSWORD,
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        
        console.log('Connected successfully!');
        console.log('Current directory:', await client.pwd());
        console.log('Directory listing:');
        const list = await client.list();
        console.log(list);
        
    } catch(err) {
        console.error('Error:', err);
    }
    
    client.close();
}

testFTPConnection();
