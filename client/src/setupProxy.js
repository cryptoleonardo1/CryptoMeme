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
      onProxyReq: (proxyReq, req, res) => {
        // Add any required headers
        proxyReq.setHeader('Accept', 'application/json');
        proxyReq.setHeader('User-Agent', 'Node.js Proxy');
      },
      onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).send({
          error: 'Proxy Error',
          message: 'Unable to reach CoinGecko API'
        });
      }
    })
  );
};