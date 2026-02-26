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
notificationBox.style.zIndex = '999999';
notificationBox.style.maxWidth = '80vw';
notificationBox.style.textAlign = 'center';
notificationBox.style.fontFamily = "'Poppins', sans-serif";
notificationBox.textContent = '';
document.body.appendChild(notificationBox);

const showNotificationBox = (message) => {
    notificationBox.textContent = message;
    notificationBox.style.opacity = '1';
    notificationBox.style.pointerEvents = 'auto';
    setTimeout(() => {
        notificationBox.style.opacity = '0';
        notificationBox.style.pointerEvents = 'none';
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
productModal.style.zIndex = '999999';

productModal.innerHTML = `
    <div style="background: white; border-radius: 10px; padding: 5vw; width: 90vw; max-width: 500px; text-align: center; position: relative; font-family: 'Poppins', sans-serif;">
        <span id="closeModal" style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer;">×</span>
        <img id="modalImage" src="" style="max-width: 100%; height: auto; border-radius: 10px;" />
        <h2 id="modalName"></h2>
        <p id="modalDescription"></p>
        <div id="modalPrice" style="margin-bottom: 20px; font-size: 20px;"></div>
        <div id="modalQuantity" style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px; font-size: 6vw;">
            <button id="qtyMinus" style="width: 10vw; height: 10vw; font-size: 7vw; border-radius: 50%; border: 1px solid #ccc; background: #f2f2f2; cursor: pointer;">–</button>
            <span id="qtyValue" style="font-size: 7vw;">1</span>
            <button id="qtyPlus" style="width: 10vw; height: 10vw; font-size: 7vw; border-radius: 50%; border: 1px solid #ccc; background: #f2f2f2; cursor: pointer;">+</button>
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
let qtyValue = 1; // default quantity
let qtyValueSpan, qtyPlus, qtyMinus;

// Quantity buttons
const resetModalQuantity = () => {
    qtyValue = 1;
    qtyValueSpan.textContent = qtyValue;
};

const setupQuantityButtons = () => {
    qtyValueSpan = document.getElementById('qtyValue');
    qtyPlus = document.getElementById('qtyPlus');
    qtyMinus = document.getElementById('qtyMinus');
    qtyPlus.addEventListener('click', () => { qtyValue++; qtyValueSpan.textContent = qtyValue; });
    qtyMinus.addEventListener('click', () => { if (qtyValue > 1) { qtyValue--; qtyValueSpan.textContent = qtyValue; } });
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

closeModal.addEventListener('click', () => { productModal.style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === productModal) productModal.style.display = 'none'; });

modalAddCart.addEventListener('click', () => {
    if (currentModalProduct) {
        addToCart(currentModalProduct.id, qtyValue);
        productModal.style.display = 'none';
        showNotificationBox(`Added ${qtyValue} × ${currentModalProduct.name} to cart`);
    }
});

setupQuantityButtons();

// Cart
const cartOverlay = document.getElementById('cartOverlay');
iconCart.addEventListener('click', () => { body.classList.toggle('showCart'); });
cartOverlay.addEventListener('click', () => { body.classList.remove('showCart'); });

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    products.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.dataset.id = product.id;
        newProduct.classList.add('item');
        newProduct.innerHTML = `<img src="${product.image}" alt=""><h2>${product.name}</h2><div class="price">RM${product.price}</div>`;
        newProduct.addEventListener('click', () => showProductModal(product));
        listProductHTML.appendChild(newProduct);
    });
};

// Cart logic
const addToCart = (product_id, quantity = 1) => {
    let index = cart.findIndex(item => item.product_id == product_id);
    if (index < 0) cart.push({ product_id, quantity });
    else cart[index].quantity += quantity;
    addCartToHTML();
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0, totalPrice = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id == item.product_id);
        totalQuantity += item.quantity;
        totalPrice += product.price * item.quantity;
        let newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.dataset.id = item.product_id;
        newItem.innerHTML = `
            <div class="image"><img src="${product.image}"></div>
            <div class="name">${product.name}</div>
            <div class="price info">RM${product.price}</div>
            <div class="quantity">
                <span class="minus">–</span>
                <span>${item.quantity}</span>
                <span class="plus">+</span>
            </div>
        `;
        listCartHTML.appendChild(newItem);
    });
    iconCartSpan.innerText = totalQuantity;
    price.innerText = `Total: RM${totalPrice.toFixed(2)}`;
};

// Quantity buttons in cart
listCartHTML.addEventListener('click', e => {
    if (e.target.classList.contains('plus') || e.target.classList.contains('minus')) {
        const product_id = e.target.closest('.item').dataset.id;
        const type = e.target.classList.contains('plus') ? 'plus' : 'minus';
        let index = cart.findIndex(item => item.product_id == product_id);
        if (index >= 0) {
            if (type === 'plus') cart[index].quantity++;
            else cart[index].quantity--;
            if (cart[index].quantity <= 0) cart.splice(index, 1);
            addCartToHTML();
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
});

// Checkout - submit only once
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) { showNotificationBox('Cart is empty!'); return; }
    document.getElementById('nameModal').style.display = 'flex';
    document.getElementById('submitRoom').disabled = false; // reset button
});

document.getElementById('submitRoom').addEventListener('click', () => {
    const btn = document.getElementById('submitRoom');
    if (btn.disabled) return; // already clicked
    btn.disabled = true;

    const customerName = document.getElementById('roomInput').value.trim();
    const customerPhone = document.getElementById('phone').value.trim();
    const fileInput = document.getElementById('transferScreenshot');
    const digitsOnly = customerPhone.replace(/\D/g, '');

    if (!customerName || !customerPhone || digitsOnly.length < 10 || !fileInput.files.length) {
        showNotificationBox('Please fill all fields correctly and attach screenshot.');
        btn.disabled = false;
        return;
    }

    const simplifiedCart = cart.map(item => {
        const product = products.find(p => p.id == item.product_id);
        return { name: product.name, quantity: item.quantity, price: product.price };
    });

    // Fake Discord webhook send (replace with real)
    console.log('Sending order:', customerName, customerPhone, simplifiedCart);

    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orderHistory.push({ date: new Date().toLocaleString(), name: customerName, phone: customerPhone, cart: simplifiedCart });
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    cart = [];
    addCartToHTML();
    localStorage.setItem('cart', JSON.stringify(cart));

    showNotificationBox(`Thank you ${customerName}! Your order has been sent.`);
    document.getElementById('nameModal').style.display = 'none';
});

// Back button
document.getElementById('backBtn').addEventListener('click', () => { document.getElementById('nameModal').style.display = 'none'; });

// Order history
const viewOrderHistoryBtn = document.getElementById('viewOrderHistoryBtn');
const orderHistoryPanel = document.getElementById('orderHistoryPanel');
const orderHistoryContainer = document.getElementById('orderHistoryContainer');
viewOrderHistoryBtn.addEventListener('click', () => {
    orderHistoryContainer.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    if (history.length === 0) orderHistoryContainer.innerHTML = '<p>No past orders.</p>';
    else history.forEach((order, i) => {
        const div = document.createElement('div');
        div.classList.add('order-history-item');
        div.innerHTML = `<h3>Order ${i+1} — ${order.date}</h3>
                         <p><strong>Room:</strong> ${order.name}</p>
                         <p><strong>Phone:</strong> ${order.phone}</p>
                         <ul>${order.cart.map(it => `<li>${it.quantity} × ${it.name} (RM${it.price})</li>`).join('')}</ul>`;
        orderHistoryContainer.appendChild(div);
    });
    orderHistoryPanel.classList.add('open');
    body.classList.add('showhistory');
});

document.getElementById('closeOrderHistoryBtn').addEventListener('click', () => {
    orderHistoryPanel.classList.remove('open');
    body.classList.remove('showhistory');
});

// Init app
const initApp = () => {
    fetch('products.json')
    .then(res => res.json())
    .then(data => { products = data; addDataToHTML(); if (localStorage.getItem('cart')) { cart = JSON.parse(localStorage.getItem('cart')); addCartToHTML(); } })
    .catch(err => console.error(err));
};

initApp();