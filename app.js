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

// Create notification box element and append to body
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

// Function to show notification text box
const showNotificationBox = (message) => {
    notificationBox.textContent = message;
    notificationBox.style.opacity = '1';
    notificationBox.style.pointerEvents = 'auto';

    setTimeout(() => {
        notificationBox.style.opacity = '0';
        notificationBox.style.pointerEvents = 'none';
    }, 2500); // Show for 2.5 seconds
};

// Show/Hide Cart
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Add product data to HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = ''; // Clear existing products

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

// Add event listener to handle "Add to Cart" button click
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
        showNotificationBox('You have added to cart');  // Notification shown here
    }
});

// Add to Cart Logic
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
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    
    addCartToHTML();
    addCartToMemory();

   
};

// Store cart in localStorage
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

                <div class="name">
                    ${info.name}
                </div>
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

// Change quantity in the cart (increment/decrement)
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

// Change quantity logic
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

// Send cart data to the backend when checkout button is clicked
const checkout = () => {
    if (cart.length < 1) {
        alert('Your cart is empty! Please add some items to your cart before checking out.');
        return; // Stop execution if cart is empty
    }

    // Prepare cart data (exclude image URLs)
    const simplifiedCart = cart.map(item => {
        const productInfo = products.find(product => product.id == item.product_id);
        return {
            name: productInfo.name,
            quantity: item.quantity,
            price: productInfo.price
        };
    });

    // Send cart data to backend server (POST request to /upload endpoint)
    fetch('http://192.168.1.58:7070/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: simplifiedCart })  // Send the simplified cart data (no images)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Checkout successful, Cart saved to server:', data);
        alert('Your order has been placed!');
        // Clear the cart or navigate to an order confirmation page if needed
        cart = [];
        addCartToHTML();
        addCartToMemory();
    })
    .catch(error => {
        console.error('Error sending cart to server during checkout:', error);
    });
};

// Event listener for Checkout button
checkoutButton.addEventListener('click', checkout);

// Initialize app (fetch product data and load saved cart)
const initApp = () => {
    // Fetch product data from a JSON file or an API endpoint
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // Get data cart from localStorage
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
    .catch(error => {
        console.error('Error fetching product data:', error);
    });
};

// Start the app
initApp();
