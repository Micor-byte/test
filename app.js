let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

let price = document.querySelector('.totalprice');
let checkoutButton = document.querySelector('.checkoutBtn');

// Notification box element
const notificationBox = document.createElement('div');
notificationBox.id = 'notification-box';
notificationBox.style.position = 'fixed';
notificationBox.style.top = '50vw';
notificationBox.style.left = '50%';
notificationBox.style.transform = 'translateX(-50%)';
notificationBox.style.backgroundColor = '#333';
notificationBox.style.color = '#fff';
notificationBox.style.padding = '5vw 10vw';
notificationBox.style.borderRadius = '2vw';
notificationBox.style.fontSize = '4vw';
notificationBox.style.opacity = '0';
notificationBox.style.pointerEvents = 'none';
notificationBox.style.transition = 'opacity 0.4s ease';
notificationBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
notificationBox.style.zIndex = '10005'; // Above overlay but below modals
notificationBox.style.maxWidth = '80vw';
notificationBox.style.textAlign = 'center';
notificationBox.style.fontFamily = "'Poppins', sans-serif";
notificationBox.textContent = '';
document.body.appendChild(notificationBox);

const showNotificationBox = (message, callback) => {
    notificationBox.textContent = message;
    notificationBox.style.opacity = '1';
    notificationBox.style.pointerEvents = 'auto';
    setTimeout(() => {
        notificationBox.style.opacity = '0';
        notificationBox.style.pointerEvents = 'none';
        if (callback) callback();
    }, 2500);
};

// Product modal
const productModal = document.createElement('div');
productModal.id = 'productModal';
productModal.style.position = 'fixed';
productModal.style.top = '0';
productModal.style.left = '0';
productModal.style.width = '100vw';
productModal.style.height = '100vh';
productModal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
productModal.style.display = 'none';
productModal.style.justifyContent = 'center';
productModal.style.alignItems = 'center';
productModal.style.zIndex = '10010'; // ABOVE overlay

productModal.innerHTML = `
    <div style="background: white; border-radius: 10px; padding: 5vw; width: 90vw; max-width: 500px; text-align: center; position: relative; font-family: 'Poppins', sans-serif;">
        <span id="closeModal" style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer;">×</span>
        <img id="modalImage" src="" style="max-width: 100%; height: auto; border-radius: 10px;" />
        <h2 id="modalName"></h2>
        <p id="modalDescription"></p>
        <div id="modalPrice" style="margin-bottom: 20px; font-size: 20px;"></div>

        <div id="modalQuantity" style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
            font-size: 6vw;
        ">
            <button id="qtyMinus" style="
                width: 10vw; height: 10vw;
                font-size: 7vw;
                border-radius: 50%;
                border: 1px solid #ccc;
                background: #f2f2f2;
                cursor: pointer;
            ">–</button>
            <span id="qtyValue" style="font-size: 7vw;">1</span>
            <button id="qtyPlus" style="
                width: 10vw; height: 10vw;
                font-size: 7vw;
                border-radius: 50%;
                border: 1px solid #ccc;
                background: #f2f2f2;
                cursor: pointer;
            ">+</button>
        </div>

        <button id="modalAddCart" class="addCart" style="padding: 10px 20px; font-size: 16px; background-color: black; color: white; border: none; border-radius: 5px;">Add To Cart</button>
    </div>
`;

document.body.appendChild(productModal);

const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalAddCart = document.getElementById('modalAddCart');
const closeModal = document.getElementById('closeModal');

let currentModalProduct = null;
let qtyValue = 1;
let qtyValueSpan, qtyPlus, qtyMinus;

const resetModalQuantity = () => {
    qtyValue = 1;
    qtyValueSpan.textContent = qtyValue;
};

const setupQuantityButtons = () => {
    qtyValueSpan = document.getElementById('qtyValue');
    qtyPlus = document.getElementById('qtyPlus');
    qtyMinus = document.getElementById('qtyMinus');

    qtyPlus.addEventListener('click', () => {
        qtyValue++;
        qtyValueSpan.textContent = qtyValue;
    });

    qtyMinus.addEventListener('click', () => {
        if (qtyValue > 1) {
            qtyValue--;
            qtyValueSpan.textContent = qtyValue;
        }
    });
};

const showProductModal = (product) => {
    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalDescription.textContent = product.description || "No description available.";
    modalPrice.textContent = `RM${product.price}`;
    currentModalProduct = product;
    productModal.style.display = 'flex';
    resetModalQuantity();
};

setupQuantityButtons();

closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.style.display = 'none';
});

modalAddCart.addEventListener('click', () => {
    if (currentModalProduct) {
        for (let i = 0; i < qtyValue; i++) addToCart(currentModalProduct.id);
        productModal.style.display = 'none';
        showNotificationBox(`Added ${qtyValue} × ${currentModalProduct.name} to cart`);
    }
});

// --- Dark overlay for cart and order history ---
const darkOverlay = document.createElement('div');
darkOverlay.id = 'darkOverlay';
darkOverlay.style.position = 'fixed';
darkOverlay.style.top = '0';
darkOverlay.style.left = '0';
darkOverlay.style.width = '100vw';
darkOverlay.style.height = '100vh';
darkOverlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
darkOverlay.style.display = 'none';
darkOverlay.style.zIndex = '9990'; // BELOW cartOverlay and modals
document.body.appendChild(darkOverlay);

// Cart overlay
const cartOverlay = document.getElementById('cartOverlay');
cartOverlay.style.zIndex = '10000'; // ABOVE overlay

const toggleOverlay = () => {
    if (body.classList.contains('showCart') || body.classList.contains('showhistory')) {
        darkOverlay.style.display = 'block';
    } else {
        darkOverlay.style.display = 'none';
    }
};

iconCart.addEventListener('click', () => {
    if (body.classList.contains('showhistory')) {
        orderHistoryPanel.classList.remove('open');
        body.classList.remove('showhistory');
    }
    body.classList.toggle('showCart');
    toggleOverlay();
});

cartOverlay.addEventListener('click', () => {
    body.classList.remove('showCart');
    toggleOverlay();
});

// --- Order history ---
const viewOrderHistoryBtn = document.getElementById('viewOrderHistoryBtn');
const orderHistoryPanel = document.getElementById('orderHistoryPanel');
orderHistoryPanel.style.zIndex = '10002'; // ABOVE overlay
const orderHistoryContainer = document.getElementById('orderHistoryContainer');

viewOrderHistoryBtn.addEventListener('click', () => {
    const isOpen = orderHistoryPanel.classList.contains('open');
    const cartOpen = body.classList.contains('showCart');

    if (cartOpen) body.classList.remove('showCart');

    if (!isOpen) {
        orderHistoryContainer.innerHTML = '';
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        if (orderHistory.length === 0) orderHistoryContainer.innerHTML = '<p>You have no past orders.</p>';
        else orderHistory.forEach((order, index) => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order-history-item');
            const itemsHTML = order.cart.map(item => `<li>${item.quantity} × ${item.name} (RM${item.price})</li>`).join('');
            orderDiv.innerHTML = `
                <h3>Order ${index + 1} — ${order.date}</h3>
                <p><strong>Room:</strong> ${order.name}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <ul>${itemsHTML}</ul>
            `;
            orderHistoryContainer.appendChild(orderDiv);
        });
    }

    orderHistoryPanel.classList.toggle('open', !isOpen);
    body.classList.toggle('showhistory', !isOpen);
    toggleOverlay();
});

function closeOrderHistory() {
    orderHistoryPanel.classList.remove('open');
    body.classList.remove('showhistory');
    toggleOverlay();
}
const closeOrderHistoryBtn = document.getElementById('closeOrderHistoryBtn');
closeOrderHistoryBtn.addEventListener('click', closeOrderHistory);

// --- Rest of your code (cart, checkout, product list functions, initApp, back button blocker) ---
// They remain unchanged