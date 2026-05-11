import { spawn } from 'child_process';
import net from 'net';

const findAvailablePort = (startPort = 3000, maxAttempts = 10) => {
  return new Promise((resolve, reject) => {
    let port = startPort;
    let attempts = 0;
    
    const checkPort = () => {
      const server = net.createServer();
      
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempts < maxAttempts) {
          port++;
          attempts++;
          checkPort();
        } else {
          reject(err);
        }
      });
      
      server.once('listening', () => {
        server.close(() => resolve(port));
      });
      
      server.listen(port, '0.0.0.0');
    };
    
    checkPort();
  });
};

const startDevServer = async () => {
  try {
    const port = await findAvailablePort(3000, 20);
    console.log(`Starting development server on port ${port}...`);
    
    const nuxtProcess = spawn('npx', ['nuxt', 'dev', '--port', port.toString()], {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    
    nuxtProcess.on('close', (code) => {
      console.log(`Development server exited with code ${code}`);
      process.exit(code);
    });
    
    nuxtProcess.on('error', (err) => {
      console.error('Error starting development server:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to find available port:', err);
    process.exit(1);
  }
};

startDevServer();
