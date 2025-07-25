const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // In development, handle API requests locally
  if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode - using local API routes');
    return;
  }

  // For production, proxy to Vercel
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://quiz-app-v2-rho.vercel.app',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '/api'
      },
      onProxyReq: (proxyReq, req, res) => {
        // Add required headers for proper forwarding
        proxyReq.setHeader('x-forwarded-host', 'localhost:3000');
        proxyReq.setHeader('origin', 'https://quiz-app-v2-rho.vercel.app');
        if (req.method === 'OPTIONS') {
          proxyReq.method = 'POST';
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        // Handle CORS headers in the response
        proxyRes.headers['access-control-allow-origin'] = 'http://localhost:3000';
        proxyRes.headers['access-control-allow-credentials'] = 'true';
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization';
      }
    })
  );
};
