// Original app.js content from commit 70ac455b4c00c01121065bf31ded8ee98062c14f with Discord webhook and product modal functionality

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL';

app.post('/webhook', (req, res) => {
    const { product, action } = req.body;
    const message = `Product ${product.name} has been ${action}.`;
    axios.post(WEBHOOK_URL, { content: message })
        .then(() => res.status(200).send('Webhook triggered!'))
        .catch(() => res.status(500).send('Error triggering webhook'));
});

app.get('/product-modal', (req, res) => {
    // Code to show product modal
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});