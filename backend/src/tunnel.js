const localtunnel = require('localtunnel');
const fs = require('fs');
const path = require('path');

async function startTunnel() {
  try {
    console.log('Establishing persistent public tunnel for port 5173...');
    const tunnel = await localtunnel({ port: 5173 });

    console.log('\n======================================================');
    console.log('🚀 PUBLIC SECURE HTTPS LINK FOR ANY LAPTOP OR PHONE');
    console.log('🌐 URL:', tunnel.url);
    console.log('🔑 Tunnel Password (if prompted): 106.216.234.137');
    console.log('======================================================\n');

    fs.writeFileSync(path.join(__dirname, '..', 'tunnel_url.txt'), tunnel.url);

    tunnel.on('close', () => {
      console.log('Tunnel connection lost. Auto-reconnecting in 5 seconds...');
      setTimeout(startTunnel, 5000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error. Reconnecting...', err);
      setTimeout(startTunnel, 5000);
    });
  } catch (err) {
    console.error('Tunnel connection failed. Retrying in 5 seconds...', err);
    setTimeout(startTunnel, 5000);
  }
}

startTunnel();
