// --- DOM Elements ---
const listProductHTML = document.querySelector('.listProduct');
const listCartHTML = document.querySelector('.listCart');
const iconCart = document.querySelector('.icon-cart');
const iconCartSpan = document.querySelector('.icon-cart span');
const body = document.querySelector('body');
const price = document.querySelector('.totalprice');
const checkoutButton = document.querySelector('.checkoutBtn');

const viewOrderHistoryBtn = document.getElementById('viewOrderHistoryBtn');
const orderHistoryPanel = document.getElementById('orderHistoryPanel');
const orderHistoryContainer = document.getElementById('orderHistoryContainer');
const closeOrderHistoryBtn = document.getElementById('closeOrderHistoryBtn');

const cartCloseBtn = document.querySelector('.cartTab .close');

let products = [];
let cart = [];
let currentModalProduct = null;
let qtyValue = 1;

// --- Notification Box ---
const notificationBox = document.createElement('div');
Object.assign(notificationBox.style, {
    position: 'fixed',
    top: '50vw',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '5vw 10vw',
    borderRadius: '2vw',
    fontSize: '4vw',
    opacity: '0',
    pointerEvents: 'none',
    transition: 'opacity 0.4s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    zIndex: '999999',
    maxWidth: '80vw',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif"
});
notificationBox.id = 'notification-box';
document.body.appendChild(notificationBox);

function showNotification(message, callback) {
    notificationBox.textContent = message;
    notificationBox.style.opacity = '1';
    notificationBox.style.pointerEvents = 'auto';
    setTimeout(() => {
        notificationBox.style.opacity = '0';
        notificationBox.style.pointerEvents = 'none';
        if (callback) callback();
    }, 2500);
}

// --- Product Modal ---
const productModal = document.createElement('div');
Object.assign(productModal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '999999'
});
productModal.id = 'productModal';
productModal.innerHTML = `
<div style="background: white; border-radius: 10px; padding: 5vw; width: 90vw; max-width: 500px; text-align: center; position: relative; font-family: 'Poppins', sans-serif;">
    <span id="closeModal" style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer;">×</span>
    <img id="modalImage" src="" style="max-width: 100%; height: auto; border-radius: 10px;" />
    <h2 id="modalName"></h2>
    <p id="modalDescription"></p>
    <div id="modalPrice" style="margin-bottom: 20px; font-size: 20px;"></div>
    <div id="modalQuantity" style="display:flex; justify-content:center; align-items:center; gap:20px; margin-bottom:20px; font-size:6vw;">
        <button id="qtyMinus" style="width:10vw;height:10vw;font-size:7vw;border-radius:50%;border:1px solid #ccc;background:#f2f2f2;cursor:pointer;">–</button>
        <span id="qtyValue" style="font-size:7vw;">1</span>
        <button id="qtyPlus" style="width:10vw;height:10vw;font-size:7vw;border-radius:50%;border:1px solid #ccc;background:#f2f2f2;cursor:pointer;">+</button>
    </div>
    <button id="modalAddCart" class="addCart" style="padding:10px 20px;font-size:16px;background:black;color:white;border:none;border-radius:5px;">Add To Cart</button>
</div>`;
document.body.appendChild(productModal);

const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalAddCart = document.getElementById('modalAddCart');
const closeModal = document.getElementById('closeModal');
const qtyValueSpan = document.getElementById('qtyValue');
const qtyPlus = document.getElementById('qtyPlus');
const qtyMinus = document.getElementById('qtyMinus');

function resetQty() { qtyValue = 1; qtyValueSpan.textContent = qtyValue; }

qtyPlus.addEventListener('click', () => { qtyValue++; qtyValueSpan.textContent = qtyValue; });
qtyMinus.addEventListener('click', () => { if(qtyValue>1){ qtyValue--; qtyValueSpan.textContent = qtyValue; } });

function showProductModalFunc(product) {
    currentModalProduct = product;
    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalDescription.textContent = product.description || "No description available.";
    modalPrice.textContent = `RM${product.price}`;
    productModal.style.display = 'flex';
    resetQty();
}

closeModal.addEventListener('click', () => productModal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === productModal) productModal.style.display='none'; });

modalAddCart.addEventListener('click', () => {
    if(currentModalProduct){
        for(let i=0;i<qtyValue;i++) addToCart(currentModalProduct.id);
        productModal.style.display='none';
        showNotification(`Added ${qtyValue} × ${currentModalProduct.name} to cart`);
    }
});

// --- Cart ---
const cartTab = document.querySelector('.cartTab');

// Toggle cart
iconCart.addEventListener('click', (e) => {
    e.stopPropagation();
    if(body.classList.contains('showhistory')){
        orderHistoryPanel.classList.remove('open');
        body.classList.remove('showhistory');
    }
    body.classList.toggle('showCart');
});

// Close cart with button
if(cartCloseBtn){
    cartCloseBtn.addEventListener('click', () => {
        body.classList.remove('showCart');
    });
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if(body.classList.contains('showCart') && !cartTab.contains(e.target) && e.target !== iconCart){
        body.classList.remove('showCart');
    }
});

function addDataToHTML() {
    listProductHTML.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.dataset.id = product.id;
        div.classList.add('item');
        div.innerHTML = `<img src="${product.image}" alt=""><h2>${product.name}</h2><div class="price">RM${product.price}</div>`;
        div.addEventListener('click', () => { if(!body.classList.contains('showhistory')) showProductModalFunc(product); });
        listProductHTML.appendChild(div);
    });
}

function addToCart(product_id) {
    const index = cart.findIndex(v=>v.product_id==product_id);
    if(index<0) cart.push({product_id, quantity:1});
    else cart[index].quantity++;
    updateCart();
}

function updateCart() {
    listCartHTML.innerHTML = '';
    let totalQuantity=0, totalPrice=0;
    cart.forEach(item=>{
        totalQuantity += item.quantity;
        const info = products.find(p=>p.id==item.product_id);
        totalPrice += item.quantity*info.price;
        const div = document.createElement('div');
        div.classList.add('item');
        div.dataset.id=item.product_id;
        div.innerHTML=`
            <div class="image"><img src="${info.image}"></div>
            <div class="name">${info.name}</div>
            <div class="price info">RM${info.price}</div>
            <div class="quantity">
                <span class="minus">–</span>
                <span>${item.quantity}</span>
                <span class="plus">+</span>
            </div>`;
        listCartHTML.appendChild(div);
    });
    iconCartSpan.innerText=totalQuantity;
    price.innerText=`Total: RM${totalPrice.toFixed(2)}`;
    localStorage.setItem('cart', JSON.stringify(cart));
}

listCartHTML.addEventListener('click', e => {
    const el = e.target;
    if(el.classList.contains('minus') || el.classList.contains('plus')){
        const product_id = el.parentElement.parentElement.dataset.id;
        const type = el.classList.contains('plus')?'plus':'minus';
        const index = cart.findIndex(v=>v.product_id==product_id);
        if(index>=0){
            if(type==='plus') cart[index].quantity++;
            else {
                cart[index].quantity--;
                if(cart[index].quantity<=0) cart.splice(index,1);
            }
        }
        updateCart();
    }
});

// --- Checkout ---
function checkout() {
    if(cart.length<1) return showNotification('Your cart is empty! Please add some items to your cart before sending.');
    const nameModal = document.getElementById('nameModal');
    nameModal.style.display='flex';
    const submitBtn = document.getElementById('submitRoom');
    submitBtn.dataset.inProgress='false';

    submitBtn.onclick = () => {
        if(submitBtn.dataset.inProgress==='true') return;
        submitBtn.dataset.inProgress='true';
        const customerName=document.getElementById('roomInput').value.trim();
        const customerPhone=document.getElementById('phone').value.trim();
        const fileInput=document.getElementById('transferScreenshot');
        const digitsOnly = customerPhone.replace(/\D/g,'');

        if(!customerName){ showNotification('Room is required.'); submitBtn.dataset.inProgress='false'; return; }
        if(!customerPhone){ showNotification('Phone number is required.'); submitBtn.dataset.inProgress='false'; return; }
        if(digitsOnly.length<10){ showNotification('Phone must be at least 10 digits.'); submitBtn.dataset.inProgress='false'; return; }
        if(!fileInput || !fileInput.files || fileInput.files.length===0){ showNotification('Please attach or pick another transfer screenshot.'); submitBtn.dataset.inProgress='false'; return; }

        submitBtn.innerText='Sending...'; submitBtn.disabled=true;

        const simplifiedCart = cart.map(item=>{
            const info = products.find(p=>p.id==item.product_id);
            return {name:info.name, quantity:item.quantity, price:info.price};
        });
        const totalPrice = simplifiedCart.reduce((acc,i)=>acc+i.quantity*i.price,0);

        const discordWebhookURL='https://discord.com/api/webhooks/1410333374085857280/wd3SnzWcrsGQ5nTCPspKHCS8lSUVqMAuQqo24T9r2FSZ9jjYpX3XOOXOGascmTT7TgfZ';
        const formData=new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('payload_json', JSON.stringify({
            content:null,
            embeds:[{
                title:`New Order from ${customerName}`,
                description:`**Phone:** ${customerPhone}\n**Order details:**`,
                color:7506394,
                fields:[...simplifiedCart.map(i=>({name:i.name, value:`Quantity: ${i.quantity} | Price: RM${i.price}`, inline:false})), {name:'Total Price', value:`RM${totalPrice.toFixed(2)}`, inline:false}],
                timestamp: new Date().toISOString()
            }]
        }));

        fetch(discordWebhookURL,{method:'POST',body:formData})
        .then(()=>{
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory'))||[];
            orderHistory.push({date:new Date().toLocaleString(), name:customerName, phone:customerPhone, cart:simplifiedCart});
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
            fileInput.value=''; cart=[]; updateCart();
            body.classList.remove('showCart');
            submitBtn.innerText='Submit'; submitBtn.disabled=false;
            showNotification(`Thank you, ${customerName}! Your order has been sent.`, ()=>{ nameModal.style.display='none'; submitBtn.dataset.inProgress='false'; });
        })
        .catch(err=>{ console.error(err); showNotification("Error submitting order. Please try again."); submitBtn.innerText='Submit'; submitBtn.disabled=false; submitBtn.dataset.inProgress='false'; });
    };
}

checkoutButton.addEventListener('click', checkout);

// --- Order History ---
function renderOrderHistory(){
    orderHistoryContainer.innerHTML='';
    const orders = JSON.parse(localStorage.getItem('orderHistory'))||[];
    if(orders.length===0) orderHistoryContainer.innerHTML='<p>You have no past orders.</p>';
    else orders.forEach((order,i)=>{
        const div=document.createElement('div');
        div.classList.add('order-history-item');
        div.innerHTML=`<h3>Order ${i+1} — ${order.date}</h3>
            <p><strong>Room:</strong> ${order.name}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <ul>${order.cart.map(item=>`<li>${item.quantity} × ${item.name} (RM${item.price})</li>`).join('')}</ul>`;
        orderHistoryContainer.appendChild(div);
    });
}

viewOrderHistoryBtn.addEventListener('click', ()=>{
    const isOpen = orderHistoryPanel.classList.contains('open');
    if(body.classList.contains('showCart')) body.classList.remove('showCart');
    if(!isOpen) renderOrderHistory();
    orderHistoryPanel.classList.toggle('open', !isOpen);
    body.classList.toggle('showhistory', !isOpen);
});

closeOrderHistoryBtn.addEventListener('click', ()=>{ orderHistoryPanel.classList.remove('open'); body.classList.remove('showhistory'); });

window.addEventListener('click', e=>{
    if(body.classList.contains('showhistory') && !orderHistoryPanel.contains(e.target) && e.target!==viewOrderHistoryBtn && !viewOrderHistoryBtn.contains(e.target)){
        orderHistoryPanel.classList.remove('open'); body.classList.remove('showhistory'); e.stopPropagation();
    }
});

// --- Init App ---
function initApp(){
    fetch('products.json')
    .then(r=>r.json())
    .then(data=>{ products=data; addDataToHTML(); if(localStorage.getItem('cart')){ cart=JSON.parse(localStorage.getItem('cart')); updateCart(); } })
    .catch(err=>console.error('Error fetching product data:',err));
}

// --- Prevent back button ---
function blockBackButton(){ history.pushState(null,null,location.href); window.addEventListener('popstate',()=>history.pushState(null,null,location.href)); }

blockBackButton();
initApp();