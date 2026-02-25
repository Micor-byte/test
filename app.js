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
        for (let i = 0; i < qtyValue; i++) {
            addToCart(currentModalProduct.id);
        }
        productModal.style.display = 'none';
        showNotificationBox(`Added ${qtyValue} × ${currentModalProduct.name} to cart`);
    }
});

const cartOverlay = document.getElementById('cartOverlay');

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

cartOverlay.addEventListener('click', () => {
    body.classList.remove('showCart');
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (products.length > 0) {
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
    }
};

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{ product_id: product_id, quantity: 1 }];
    } else if (positionThisProductInCart < 0) {
        cart.push({ product_id: product_id, quantity: 1 });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            totalPrice += item.quantity * info.price;
            newItem.innerHTML = `
                <div class="image"><img src="${info.image}"></div>
                <div class="name">${info.name}</div>
                <div class="price info">RM${info.price}</div>
                <div class="quantity">
                    <span class="minus">–</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
            listCartHTML.appendChild(newItem);
        });
    }
    iconCartSpan.innerText = totalQuantity;
    price.innerText = `Total: RM${totalPrice.toFixed(2)}`;
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        if (type === 'plus') {
            cart[positionItemInCart].quantity += 1;
        } else {
            let newQuantity = cart[positionItemInCart].quantity - 1;
            if (newQuantity > 0) {
                cart[positionItemInCart].quantity = newQuantity;
            } else {
                cart.splice(positionItemInCart, 1);
            }
        }
    }
    addCartToHTML();
    addCartToMemory();
};

// Checkout with screenshot required
checkoutButton.addEventListener('click', () => {
    if (cart.length < 1) {
        showNotificationBox('Your cart is empty! Please add some items before checkout.');
        return;
    }

    document.getElementById('nameModal').style.display = 'flex';
    const modalTotal = document.getElementById('modalTotal');
    const totalPrice = cart.reduce((acc, item) => {
        const p = products.find(prod => prod.id == item.product_id);
        return acc + (p.price * item.quantity);
    }, 0);
    modalTotal.textContent = `RM${totalPrice.toFixed(2)}`;
});

// Submit order
document.getElementById('submitRoom').addEventListener('click', () => {
    const customerName = document.getElementById('roomInput').value.trim();
    const customerPhone = document.getElementById('phone').value.trim();
    const fileInput = document.getElementById('transferScreenshot');
    const file = fileInput.files[0];

    if (!customerName) {
        showNotificationBox('Room is required.');
        return;
    }
    if (!customerPhone) {
        showNotificationBox('Phone is required.');
        return;
    }
    if (!file) {
        showNotificationBox('Screenshot attachment has not been attached yet!');
        return;
    }

    const simplifiedCart = cart.map(item => {
        const productInfo = products.find(p => p.id == item.product_id);
        return {
            name: productInfo.name,
            quantity: item.quantity,
            price: productInfo.price
        };
    });
    const totalPrice = simplifiedCart.reduce((acc, item) => acc + item.quantity * item.price, 0);

    // Discord webhook submission
    const discordWebhookURL = 'https://discord.com/api/webhooks/...'; // your webhook
    const formData = new FormData();
    formData.append('content', `New order from ${customerName} | Phone: ${customerPhone} | Total: RM${totalPrice.toFixed(2)}`);
    formData.append('file', file);

    fetch(discordWebhookURL, { method: 'POST', body: formData })
        .then(() => {
            // Save to order history
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
            orderHistory.push({
                date: new Date().toLocaleString(),
                name: customerName,
                phone: customerPhone,
                cart: simplifiedCart,
                screenshotName: file.name
            });
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

            showNotificationBox(`Thank you, ${customerName}! Your order has been sent.`);
            cart = [];
            addCartToHTML();
            addCartToMemory();
            fileInput.value = '';
            document.getElementById('transferFilename').innerText = 'No file chosen';
            document.getElementById('nameModal').style.display = 'none';
            updateOrderHistoryPanel();
        })
        .catch(err => {
            console.error(err);
            showNotificationBox("Error submitting order. Try again.");
        });
});

// Update order history panel
const orderHistoryContainer = document.getElementById('orderHistoryContainer');
const viewOrderHistoryBtn = document.getElementById('viewOrderHistoryBtn');

function updateOrderHistoryPanel() {
    orderHistoryContainer.innerHTML = '';
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    if (orderHistory.length === 0) {
        orderHistoryContainer.innerHTML = '<p>You have no past orders.</p>';
    } else {
        orderHistory.forEach((order, idx) => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order-history-item');
            const itemsHTML = order.cart.map(item => `<li>${item.quantity} × ${item.name} (RM${item.price})</li>`).join('');
            orderDiv.innerHTML = `
                <h3>Order ${idx + 1} — ${order.date}</h3>
                <p><strong>Room:</strong> ${order.name}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <ul>${itemsHTML}</ul>
                <p><strong>Screenshot:</strong> ${order.screenshotName || 'No file attached'}</p>
            `;
            orderHistoryContainer.appendChild(orderDiv);
        });
    }
}

viewOrderHistoryBtn.addEventListener('click', () => {
    updateOrderHistoryPanel();
    document.getElementById('orderHistoryPanel').classList.toggle('open');
    body.classList.toggle('showhistory');
});

// Init app
const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        })
        .catch(err => console.error(err));
};

initApp();