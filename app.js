const Webhook = require('discord-webhook-node');

const hook = new Webhook('YOUR_DISCORD_WEBHOOK_URL');

hook.setUsername('Webhook Bot');

hook.send('Hello, this is a message from the bot!');
