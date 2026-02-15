// Simple Node.js HTTP server — deployed via Kubernetes on EKS
const http = require('http');
const os   = require('os');

const PORT = process.env.PORT || 3000;
const ENV  = process.env.APP_ENV || 'unknown';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    // Kubernetes liveness probe endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    return;
  }

  if (req.url === '/ready') {
    // Kubernetes readiness probe endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ready', timestamp: new Date().toISOString() }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message:  'Hello from Kubernetes on AWS EKS!',
    hostname: os.hostname(),      // Shows the pod name
    environment: ENV,
    version:  '1.0.0',
    timestamp: new Date().toISOString()
  }));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} | env: ${ENV} | host: ${os.hostname()}`);
});

// Graceful shutdown — important for Kubernetes pod termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
