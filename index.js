const { createProxyMiddleware } = require("http-proxy-middleware")
const express = require('express');
const authMiddleware = require("./middleware/auth");
const limiter = require("express-rate-limit");

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3100';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3110';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiterMiddleware = limiter({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 10
});

app.use(limiterMiddleware);


app.use("*", (req, res, next) => {
    console.log("Request was made to: " + req.originalUrl);
    return next();
})


app.use('/api/products', authMiddleware, createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true
}));

app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    on:{
        proxyReq: (proxyReq, req, res) => {
            if(req.body){
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        }
    }
}));

app.get("/health", (req, res) => {
    res.json({ message: "product-service is running" });
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})