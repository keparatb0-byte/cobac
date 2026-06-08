const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Konfigurasi Proxy ke Idlix
app.use('/', createProxyMiddleware({
    target: 'https://z2.idlixku.com',
    changeOrigin: true,
    on: {
        proxyRes: function (proxyRes, req, res) {
            // PENTING: Hapus header keamanan bawaan Idlix yang memblokir TV
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];

            // Suntikkan header baru agar diizinkan oleh browser Tizen TV
            res.setHeader('X-Frame-Options', 'ALLOWALL');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Security-Policy', "frame-ancestors *");
        }
    }
}));

module.exports = app;