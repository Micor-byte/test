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

// Checkout and name modal
const checkout = () => {
    if (cart.length < 1) {
        showNotificationBox('Your cart is empty! Please add some items to your cart before sending.');
        return;
    }

    const nameModal = document.getElementById('nameModal');
    nameModal.style.display = 'flex';

    document.getElementById('submitRoom').onclick = () => {
        const customerName = document.getElementById('roomInput').value.trim();
        const customerPhone = document.getElementById('phone').value.trim();
        const fileInput = document.getElementById('transferScreenshot');
        const digitsOnly = customerPhone.replace(/\D/g, '');

        if (!customerName) {
            showNotificationBox('Room is required to place an order.');
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
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            showNotificationBox('You must attach a screenshot before sending.');
            return;
        }

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

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('payload_json', JSON.stringify({
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
        }));

        fetch(discordWebhookURL, {
            method: 'POST',
            body: formData
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

            // ✅ CLOSE MODAL IMMEDIATELY
            nameModal.style.display = 'none';

            // ✅ SHOW NOTIFICATION
            showNotificationBox(`Thank you, ${customerName}! Your order has been sent and we will prepare your product as soon as possible.`);

            // ✅ CLEAR CART + INPUT
            cart = [];
            addCartToHTML();
            addCartToMemory();
            fileInput.value = '';

            // reset filename text if exists
            const filenameSpan = document.getElementById('transferFilename');
            if (filenameSpan) filenameSpan.innerText = 'No file chosen';
        })
        .catch(error => {
            console.error('Error sending order to Discord webhook:', error);
            showNotificationBox("There was an error submitting your order. Please try again.");
        });
    };
};

checkoutButton.addEventListener('click', checkout);