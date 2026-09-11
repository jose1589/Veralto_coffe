// Estado global del Carrito
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCartEvents();
});

// 1. Animaciones al hacer Scroll (Intersection Observer API)
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(el => observer.observe(el));
}

// 2. Control del Carrito de Compras
function initCartEvents() {
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);
}

function closeCartSidebar() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
}

// 3. Añadir Producto
function addToCart(title, price) {
    const existingItem = cart.find(item => item.title === title);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ title, price, quantity: 1 });
    }

    updateCartUI();
    
    // Abrir el carrito para mostrar el producto añadido
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('active');
}

// 4. Actualizar la interfaz del carrito
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">El carrito está vacío</p>';
        cartCount.textContent = '0';
        cartTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    let totalCount = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalCount += item.quantity;

        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
            </div>
            <div>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; margin-left:10px; cursor:pointer;">&times;</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartCount.textContent = totalCount;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// 5. Eliminar Producto
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}
