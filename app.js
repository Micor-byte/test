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
        <span id="closeModal" style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer;">&times;</span>
        <img id="modalImage" src="" style="max-width: 100%; height: auto; border-radius: 10px;" />
        <h2 id="modalName"></h2>
        <p id="modalDescription"></p>
        <div id="modalPrice" style="margin-bottom: 20px; font-size: 20px;"></div>
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

const showProductModal = (product) => {
    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalDescription.textContent = product.description || "No description available.";
    modalPrice.textContent = `RM${product.price}`;
    currentModalProduct = product;
    productModal.style.display = 'flex';
};

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
        addToCart(currentModalProduct.id);
        productModal.style.display = 'none';
        showNotificationBox('You have added to cart');
    }
});

// Overlay for cart
const cartOverlay = document.getElementById('cartOverlay');

// Cart show/hide
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

// Close history panel on outside click
document.addEventListener('click', (event) => {
    const isHistoryOpen = orderHistoryPanel.classList.contains('open');
    const clickedInsideHistory = orderHistoryPanel.contains(event.target);
    const clickedHistoryButton = viewOrderHistoryBtn.contains(event.target);
    if (isHistoryOpen && !clickedInsideHistory && !clickedHistoryButton) {
        orderHistoryPanel.classList.remove('open');
        body.classList.remove('showhistory');
    }
});

// Add product cards to DOM
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

// Cart functionality
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
                    <span class="minus">minus</span>
                    <span>${item.quantity}</span>
                   <span class="plus">add</span>
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

// Checkout and name modal
const checkout = () => {
    if (cart.length < 1) {
        showNotificationBox('Your cart is empty! Please add some items to your cart before checking out.');
        return;
    }

    document.getElementById('nameModal').style.display = 'flex';

    document.getElementById('submitRoom').onclick = () => {
        const customerName = document.getElementById('roomInput').value.trim();
        const customerPhone = document.getElementById('phone').value.trim();
        const digitsOnly = customerPhone.replace(/\D/g, '');

        if (!customerName) {
            showNotificationBox('Room number is required to place an order.');
            return;
        }
        if (!customerPhone) {
            showNotificationBox('Phone number is required to place an order.');
            return;
        }
        if (digitsOnly.length < 10) {
            showNotificationBox('Phone number must be at least 10 digits.');
            return;
        }

        document.getElementById('nameModal').style.display = 'none';

        const simplifiedCart = cart.map(item => {
            const productInfo = products.find(product => product.id == item.product_id);
            return {
                name: productInfo.name,
                quantity: item.quantity,
                price: productInfo.price
            };
        });

        const totalPrice = simplifiedCart.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const discordWebhookURL = 'https://discord.com/api/webhooks/1410333374085857280/wd3SnzWcrsGQ5nTCPspKHCS8lSUVqMAuQqo24T9r2FSZ9jjYpX3XOOXOGascmTT7TgfZ';

        fetch(discordWebhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: null,
                embeds: [
                    {
                        title: `New Order from ${customerName}`,
                        description: `**Phone:** ${customerPhone}\n**Order details:**`,
                        color: 7506394,
                        fields: [
                            ...simplifiedCart.map(item => ({
                                name: item.name,
                                value: `Quantity: ${item.quantity} | Price: RM${item.price}`,
                                inline: false
                            })),
                            {
                                name: 'Total Price',
                                value: `RM${totalPrice.toFixed(2)}`,
                                inline: false
                            }
                        ],
                        timestamp: new Date().toISOString()
                    }
                ]
            })
        })
        .then(() => {
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
            orderHistory.push({
                date: new Date().toLocaleString(),
                name: customerName,
                phone: customerPhone,
                cart: simplifiedCart
            });
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
            showNotificationBox(`Thank you, ${customerName}! Your order has been placed.`);
            cart = [];
            addCartToHTML();
            addCartToMemory();
        })
        .catch(error => {
            console.error('Error sending order to Discord webhook:', error);
            showNotificationBox("There was an error submitting your order. Please try again.");
        });
    };
};
checkoutButton.addEventListener('click', checkout);

// Order history panel
const viewOrderHistoryBtn = document.getElementById('viewOrderHistoryBtn');
const orderHistoryPanel = document.getElementById('orderHistoryPanel');
const orderHistoryContainer = document.getElementById('orderHistoryContainer');

viewOrderHistoryBtn.addEventListener('click', () => {
    const isOpen = orderHistoryPanel.classList.contains('open');
    const cartOpen = body.classList.contains('showCart');

    if (cartOpen) {
        body.classList.remove('showCart');
    }

    if (!isOpen) {
        orderHistoryContainer.innerHTML = '';
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

        if (orderHistory.length === 0) {
            orderHistoryContainer.innerHTML = '<p>You have no past orders.</p>';
        } else {
            orderHistory.forEach((order, index) => {
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
    }

    orderHistoryPanel.classList.toggle('open', !isOpen);
    body.classList.toggle('showhistory', !isOpen);
});

function closeOrderHistory() {
    orderHistoryPanel.classList.remove('open');
    body.classList.remove('showhistory');
}
const closeOrderHistoryBtn = document.getElementById('closeOrderHistoryBtn');
closeOrderHistoryBtn.addEventListener('click', closeOrderHistory);

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
    .catch(error => {
        console.error('Error fetching product data:', error);
    });
};


// Full back button blocker for Android mobile browsers
function blockBackButton() {
    history.pushState(null, null, location.href);

    window.addEventListener('popstate', function () {
        history.pushState(null, null, location.href); // Prevent going back
      
    });
}

blockBackButton(); // Call once when the app loads


initApp();
