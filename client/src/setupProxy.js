// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/coingecko',
    createProxyMiddleware({
      target: 'https://api.coingecko.com/api/v3',
      changeOrigin: true,
      pathRewrite: {
        '^/api/coingecko': ''
      },
      onProxyReq: (proxyReq) => {
        // Add required headers
        proxyReq.setHeader('Accept', 'application/json');
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
        proxyReq.setHeader('Referer', 'https://api.coingecko.com');
      },
      onProxyRes: (proxyRes) => {
        // Add CORS headers
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
        proxyRes.headers['Access-Control-Max-Age'] = '3600';
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ error: 'Proxy Error', message: err.message }));
      }
    })
  );
};