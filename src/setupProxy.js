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
      target: 'https://quiz-app-master-tau.vercel.app',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req) => {
        if (req.method === 'OPTIONS') {
          proxyReq.method = 'POST';
        }
      },
      onProxyRes: function(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization';
      }
    })
  );
};
