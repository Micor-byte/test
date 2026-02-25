// Elements
const listProductHTML = document.querySelector('#listProduct');
const listCartHTML = document.querySelector('#listCart');
const iconCart = document.querySelector('#iconCart');
const cartSpan = document.querySelector('#cartSpan');
const body = document.querySelector('body');
const closeCart = document.querySelector('#closeCart');

// Notification box
const notificationBox = document.createElement('div');
notificationBox.id = 'notificationBox';
notificationBox.style.position = 'fixed';
notificationBox.style.top = '50px';
notificationBox.style.left = '50%';
notificationBox.style.transform = 'translate(-50%)';
notificationBox.style.backgroundColor = '#000';
notificationBox.style.color = '#fff';
notificationBox.style.padding = '10px';
notificationBox.style.borderRadius = '2px';
notificationBox.style.fontSize = '14px';
notificationBox.style.opacity = 0;
notificationBox.style.pointerEvents = 'none';
notificationBox.style.transition = 'opacity 0.4s';
notificationBox.style.zIndex = 999999;
notificationBox.style.textAlign = 'center';
notificationBox.style.fontFamily = 'Poppins, sans-serif';
document.body.appendChild(notificationBox);

function showNotification(message) {
    notificationBox.textContent = message;
    notificationBox.style.opacity = 1;
    notificationBox.style.pointerEvents = 'auto';
    setTimeout(() => {
        notificationBox.style.opacity = 0;
        notificationBox.style.pointerEvents = 'none';
    }, 3000);
}

// Product modal
const productModal = document.createElement('div');
productModal.id = 'productModal';
productModal.style.position = 'fixed';
productModal.style.top = '0';
productModal.style.left = '0';
productModal.style.width = '100%';
productModal.style.height = '100%';
productModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
productModal.style.display = 'none';
productModal.style.justifyContent = 'center';
productModal.style.alignItems = 'center';
productModal.style.zIndex = 1000;
productModal.innerHTML = `
<div style="background:white;border-radius:10px;padding:20px;width:300px;text-align:center;position:relative;font-family:Poppins,sans-serif;">
    <span id="closeModal" style="position:absolute;top:10px;right:10px;cursor:pointer;font-size:24px;">&times;</span>
    <img id="modalImage" style="max-width:100%;height:auto;border-radius:10px;margin-bottom:20px;">
    <h3 id="modalName"></h3>
    <p id="modalDescription"></p>
    <p id="modalPrice"></p>
    <div style="display:flex;justify-content:center;align-items:center;margin-bottom:20px;">
        <button id="qtyMinus" style="width:40px;height:40px;font-size:24px;">-</button>
        <span id="qtyValue" style="margin:0 10px;font-size:20px;">1</span>
        <button id="qtyPlus" style="width:40px;height:40px;font-size:24px;">+</button>
    </div>
    <button id="modalAddCart" style="padding:10px 20px;font-size:16px;background:black;color:white;border:none;border-radius:5px;cursor:pointer;">Add to Cart</button>
</div>
`;
document.body.appendChild(productModal);

// Modal variables
let currentModalProduct = null;
let qtyValue = 1;

const qtyValueSpan = document.getElementById('qtyValue');
const qtyPlus = document.getElementById('qtyPlus');
const qtyMinus = document.getElementById('qtyMinus');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalAddCart = document.getElementById('modalAddCart');
const closeModal = document.getElementById('closeModal');

function resetQuantity() {
    qtyValue = 1;
    qtyValueSpan.textContent = qtyValue;
}

qtyPlus.addEventListener('click', () => {
    qtyValue++;
    qtyValueSpan.textContent = qtyValue;
});

qtyMinus.addEventListener('click', () => {
    if (qtyValue > 1) qtyValue--;
    qtyValueSpan.textContent = qtyValue;
});

closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

function showProductModal(product) {
    currentModalProduct = product;
    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalDescription.textContent = product.description || 'No description available';
    modalPrice.textContent = `$${product.price.toFixed(2)}`;
    resetQuantity();
    productModal.style.display = 'flex';
}

// Cart
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += qtyValue;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: qtyValue });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${product.name} added to cart!`);
    updateCartDisplay();
}

modalAddCart.addEventListener('click', () => {
    if (!currentModalProduct) return;
    addToCart(currentModalProduct);
    productModal.style.display = 'none';
});

function updateCartDisplay() {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;
    cart.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `${item.name} x${item.quantity} - $${item.price * item.quantity}`;
        listCartHTML.appendChild(div);
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
    });
    cartSpan.innerText = totalQuantity;
}

// Discord webhook checkout
const checkoutButton = document.getElementById('checkoutButton');
const discordWebhookURL = 'https://discord.com/api/webhooks/141033337408585728062479/3F529JYpX300X00777yfz';

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Cart is empty! Please add items.');
        return;
    }

    const customerName = document.getElementById('nameModal').value.trim();
    const customerPhone = document.getElementById('phoneModal').value.trim().replace(/\D/g, '');

    if (!customerName || !customerPhone || customerPhone.length < 10) {
        showNotification('Please enter valid name and phone number.');
        return;
    }

    const simplifiedCart = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));

    const totalPrice = simplifiedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    fetch(discordWebhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: null,
            embeds: [{
                title: `New Order from ${customerName}`,
                description: `Phone: ${customerPhone}`,
                fields: simplifiedCart.map(item => ({
                    name: item.name,
                    value: `Quantity: ${item.quantity}, Price: $${item.price.toFixed(2)}`,
                    inline: true
                })),
                color: 7566394
            }]
        })
    }).then(() => {
        showNotification(`Thank you, ${customerName}! Your order has been sent.`);
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }).catch(err => {
        console.error('Error sending order:', err);
        showNotification('Error submitting your order. Please try again.');
    });
});

// Initial display
updateCartDisplay();