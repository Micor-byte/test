let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

// Create a label to connect HTML to JavaScript
let price = document.querySelector('.totalprice');

// Checkout Button
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
notificationBox.style.zIndex = '9999';
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

const cartOverlay = document.getElementById('cartOverlay');

// Show/Hide Cart
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

document.addEventListener('click', (event) => {
    const isHistoryOpen = orderHistoryPanel.classList.contains('open');
    const clickedInsideHistory = orderHistoryPanel.contains(event.target);
    const clickedHistoryButton = viewOrderHistoryBtn.contains(event.target);
  
    if (isHistoryOpen && !clickedInsideHistory && !clickedHistoryButton) {
      orderHistoryPanel.classList.remove('open');
      body.classList.remove('showhistory');
    }
  });
  


// Add product data to HTML
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
                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Add to Cart event
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
        showNotificationBox('You have added to cart');
    }
});

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);

    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Update cart UI
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
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="price info">RM${info.price}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            listCartHTML.appendChild(newItem);
        });
    }

    iconCartSpan.innerText = totalQuantity;
    price.innerText = `Total: RM${totalPrice}`;
};

// Change quantity logic
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
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            case 'minus':
                let newQuantity = cart[positionItemInCart].quantity - 1;
                if (newQuantity > 0) {
                    cart[positionItemInCart].quantity = newQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};

// Checkout and name modal
const checkout = () => {
    if (cart.length < 1) {
        alert('Your cart is empty! Please add some items to your cart before checking out.');
        return;
    }

    document.getElementById('nameModal').style.display = 'flex';

    document.getElementById('submitRoom').onclick = () => {
        const customerName = document.getElementById('roomInput').value.trim();
        const customerPhone = document.getElementById('phone').value.trim();
        const digitsOnly = customerPhone.replace(/\D/g, '');

        if (!customerName) {
            alert('Room number is required to place an order.');
            return;
        }
        if (!customerPhone) {
            alert('Phone number is required to place an order.');
            return;
        }
        if (digitsOnly.length < 10) {
            alert('Phone number must be at least 10 digits.');
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

        fetch('  https://contamination-accept-decades-jane.trycloudflare.com /upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: customerName,
                phone: customerPhone,
                cart: simplifiedCart
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Checkout successful, cart saved to server:', data);

            // Save order history locally before clearing cart
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

            orderHistory.push({
                date: new Date().toLocaleString(),
                name: customerName,
                phone: customerPhone,
                cart: simplifiedCart
            });

            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

            alert(`Thank you, ${customerName}! Your order has been placed.`);
            cart = [];
            addCartToHTML();
            addCartToMemory();
        })
        .catch(error => {
            console.error('Error sending cart to server during checkout:', error);
            alert("There was an error submitting your order. Please try again.");
        });
    };
};

checkoutButton.addEventListener('click', checkout);

// Order history sliding panel (from left side)
const viewOrderHistoryBtn = document.getElementById('viewOrderHistoryBtn');
const orderHistoryPanel = document.getElementById('orderHistoryPanel'); // sliding panel container
const orderHistoryContainer = document.getElementById('orderHistoryContainer'); // content container inside panel

viewOrderHistoryBtn.addEventListener('click', () => {
    const isOpen = orderHistoryPanel.classList.contains('open');
    const cartOpen = body.classList.contains('showCart');

    if (cartOpen) {
        body.classList.remove('showCart');
    }

    if (!isOpen) {
        // Populate order history content
        orderHistoryContainer.innerHTML = '';
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

        if (orderHistory.length === 0) {
            orderHistoryContainer.innerHTML = '<p>You have no past orders.</p>';
        } else {
            orderHistory.forEach((order, index) => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order-history-item');
                const itemsHTML = order.cart.map(item => {
                    return `<li>${item.quantity} × ${item.name} (RM${item.price})</li>`;
                }).join('');
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




// Close order history function
function closeOrderHistory() {
    orderHistoryPanel.classList.remove('open');
    body.classList.remove('showhistory');
}

  
  // Attach event listener to the close button
  const closeOrderHistoryBtn = document.getElementById('closeOrderHistoryBtn');
  closeOrderHistoryBtn.addEventListener('click', closeOrderHistory);

  
  






// Initialize app (fetch products and load cart)
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

initApp();
