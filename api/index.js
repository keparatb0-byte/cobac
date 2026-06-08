const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://z2.idlixku.com',
    changeOrigin: true,
    // PENTING: Paksa server menggunakan opsi secure false jika ada masalah sertifikat
    secure: false, 
    on: {
        proxyReq: function (proxyReq, req, res) {
            // TRIK MENEMBUS BLOKIR: Palsukan header seolah-olah ini dari Browser Chrome Windows asli
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept-Language', 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7');
            proxyReq.setHeader('Referer', 'https://z2.idlixku.com/');
        },
        proxyRes: function (proxyRes, req, res) {
            // Hapus header keamanan Idlix yang memblokir iframe Tizen TV
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            
            // Berikan izin penuh ke browser TV
            res.setHeader('X-Frame-Options', 'ALLOWALL');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Security-Policy', "frame-ancestors *");
        }
    }
}));

module.exports = app;
