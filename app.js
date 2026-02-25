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
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

modalAddCart.addEventListener('click', () => {
    if (currentModalProduct) {
        for (let i = 0; i < qtyValue; i++) addToCart(currentModalProduct.id);
        productModal.style.display = 'none';
        showNotificationBox(`Added ${qtyValue} × ${currentModalProduct.name} to cart`);
    }
});

// Cart overlay & toggle
const cartOverlay = document.getElementById('cartOverlay');

iconCart.addEventListener('click', () => {
    if (body.classList.contains('showhistory')) {
        orderHistoryPanel.classList.remove('open');
        body.classList.remove('showhistory');
    }
    body.classList.toggle('showCart');
});

cartOverlay.addEventListener('click', () => {
    body.classList.remove('showCart');
});

// Add product cards
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    products.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.dataset.id = product.id;
        newProduct.classList.add('item');
        newProduct.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">RM${product.price}</div>
        `;
        newProduct.addEventListener('click', () => showProductModal(product));
        listProductHTML.appendChild(newProduct);
    });
};

// Cart functions
const addToCart = (product_id) => {
    let idx = cart.findIndex(v => v.product_id == product_id);
    if (idx < 0) cart.push({ product_id, quantity: 1 });
    else cart[idx].quantity += 1;
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => localStorage.setItem('cart', JSON.stringify(cart));

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0, totalPrice = 0;
    cart.forEach(item => {
        totalQuantity += item.quantity;
        let prod = products.find(p => p.id == item.product_id);
        totalPrice += item.quantity * prod.price;
        let newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.dataset.id = item.product_id;
        newItem.innerHTML = `
            <div class="image"><img src="${prod.image}"></div>
            <div class="name">${prod.name}</div>
            <div class="price info">RM${prod.price}</div>
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

listCartHTML.addEventListener('click', e => {
    if (e.target.classList.contains('minus') || e.target.classList.contains('plus')) {
        let product_id = e.target.parentElement.parentElement.dataset.id;
        changeQuantityCart(product_id, e.target.classList.contains('plus') ? 'plus' : 'minus');
    }
});

const changeQuantityCart = (product_id, type) => {
    let idx = cart.findIndex(v => v.product_id == product_id);
    if (idx < 0) return;
    if (type === 'plus') cart[idx].quantity += 1;
    else {
        cart[idx].quantity -= 1;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    }
    addCartToHTML();
    addCartToMemory();
};

// Checkout
const checkout = () => {
    if (cart.length < 1) {
        showNotificationBox('Your cart is empty!');
        return;
    }

    document.getElementById('nameModal').style.display = 'flex';

    document.getElementById('submitRoom').onclick = () => {
        const customerName = document.getElementById('roomInput').value.trim();
        const customerPhone = document.getElementById('phone').value.trim();
        const digitsOnly = customerPhone.replace(/\D/g, '');
        const fileInput = document.getElementById('transferScreenshot');

        // ✅ Block if "No file chosen" is displayed
        if (!fileInput || fileInput.files.length === 0 || fileInput.value === 'No file chosen') {
            showNotificationBox('Please attach a screenshot of your transfer!');
            return;
        }

        if (!customerName) { showNotificationBox('Room is required.'); return; }
        if (!customerPhone) { showNotificationBox('Phone number is required.'); return; }
        if (digitsOnly.length < 10) { showNotificationBox('Phone number must be at least 10 digits.'); return; }

        document.getElementById('nameModal').style.display = 'none';

        const simplifiedCart = cart.map(item => {
            const p = products.find(prod => prod.id == item.product_id);
            return { name: p.name, quantity: item.quantity, price: p.price };
        });

        const totalPrice = simplifiedCart.reduce((acc, i) => acc + i.quantity * i.price, 0);
        const webhookURL = 'https://discord.com/api/webhooks/...';

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('payload_json', JSON.stringify({
            content: null,
            embeds: [{
                title: `New Order from ${customerName}`,
                description: `**Phone:** ${customerPhone}\n**Order details:**`,
                color: 7506394,
                fields: [
                    ...simplifiedCart.map(i => ({ name: i.name, value: `Quantity: ${i.quantity} | Price: RM${i.price}`, inline: false })),
                    { name: 'Total Price', value: `RM${totalPrice.toFixed(2)}`, inline: false }
                ],
                timestamp: new Date().toISOString()
            }]
        }));

        fetch(webhookURL, { method: 'POST', body: formData })
        .then(() => {
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
            orderHistory.push({ date: new Date().toLocaleString(), name: customerName, phone: customerPhone, cart: simplifiedCart });
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
            showNotificationBox(`Thank you, ${customerName}! Your order has been sent.`);
            cart = [];
            addCartToHTML();
            addCartToMemory();
            fileInput.value = '';
        })
        .catch(err => { console.error(err); showNotificationBox('Error submitting order.'); });
    };
};
checkoutButton.addEventListener('click', checkout);

// Order history panel
const viewOrderHistoryBtn = document.getElementById('viewOrderHistoryBtn');
const orderHistoryPanel = document.getElementById('orderHistoryPanel');
const orderHistoryContainer = document.getElementById('orderHistoryContainer');

viewOrderHistoryBtn.addEventListener('click', () => {
    const isOpen = orderHistoryPanel.classList.contains('open');
    if (!isOpen) {
        orderHistoryContainer.innerHTML = '';
        const history = JSON.parse(localStorage.getItem('orderHistory')) || [];
        if (history.length === 0) orderHistoryContainer.innerHTML = '<p>No past orders.</p>';
        else history.forEach((order, idx) => {
            const div = document.createElement('div');
            const itemsHTML = order.cart.map(i => `<li>${i.quantity} × ${i.name} (RM${i.price})</li>`).join('');
            div.innerHTML = `<h3>Order ${idx+1} — ${order.date}</h3><p><strong>Room:</strong> ${order.name}</p><p><strong>Phone:</strong> ${order.phone}</p><ul>${itemsHTML}</ul>`;
            orderHistoryContainer.appendChild(div);
        });
    }
    orderHistoryPanel.classList.toggle('open', !isOpen);
    body.classList.toggle('showhistory', !isOpen);
});

document.getElementById('closeOrderHistoryBtn').addEventListener('click', () => {
    orderHistoryPanel.classList.remove('open');
    body.classList.remove('showhistory');
});

// Init app
const initApp = () => {
    fetch('products.json')
    .then(res => res.json())
    .then(data => {
        products = data;
        addDataToHTML();
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
    .catch(console.error);
};

// Android back button blocker
function blockBackButton() {
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.pushState(null, null, location.href));
}
blockBackButton();
initApp();