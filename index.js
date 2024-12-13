const { createProxyMiddleware } = require("http-proxy-middleware")
const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3100';

app.use(express.json());


app.use('/api/products', createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true
}));

app.get("/health", (req, res) => {
    res.json({ message: "product-service is running" });
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})