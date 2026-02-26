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
    if (e.target === productModal) productModal.style.display = 'none';
});

modalAddCart.addEventListener('click', () => {
    if (currentModalProduct) {
        for (let i = 0; i < qtyValue; i++) addToCart(currentModalProduct.id);
        productModal.style.display = 'none';
        showNotificationBox(`Added ${qtyValue} × ${currentModalProduct.name} to cart`);
    }
});

// Overlay for cart
const cartOverlay = document.getElementById('cartOverlay');
cartOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
cartOverlay.style.display = 'none';

iconCart.addEventListener('click', () => {
    if (body.classList.contains('showhistory')) closeOrderHistory();
    body.classList.toggle('showCart');
    cartOverlay.style.display = body.classList.contains('showCart') ? 'block' : 'none';
});

cartOverlay.addEventListener('click', () => {
    body.classList.remove('showCart');
    cartOverlay.style.display = 'none';
});

// Close history panel by clicking outside
document.addEventListener('click', (event) => {
    const isHistoryOpen = orderHistoryPanel.classList.contains('open');
    const clickedInsideHistory = orderHistoryPanel.contains(event.target);
    const clickedHistoryButton = viewOrderHistoryBtn && viewOrderHistoryBtn.contains(event.target);
    if (isHistoryOpen && !clickedInsideHistory && !clickedHistoryButton) {
        closeOrderHistory();
    }
});

// Add products, cart functions, checkout, order history remain unchanged...
// (Your original code for addDataToHTML, addToCart, addCartToHTML, changeQuantityCart, checkout, orderHistoryPanel etc.)

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
    .catch(err => console.error(err));
};

// Block back button
function blockBackButton() {
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.pushState(null, null, location.href));
}
blockBackButton();
initApp();