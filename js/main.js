/* ==========================================================================
   CONFIGURACIÓN DE CREDENCIALES REALES
   ========================================================================== */
// [CONFIGURACIÓN] Tus credenciales exactas registradas para EmailJS:
const EMAILJS_PUBLIC_KEY = "pANs_SwfJtc0dwNst";
const EMAILJS_SERVICE_ID = "service_mkjt7p6";
const EMAILJS_TEMPLATE_ID = "template_f982tvu";

// [CONFIGURACIÓN] Número de WhatsApp de destino (Estructura: Código país + Número)
const WHATSAPP_PHONE_NUMBER = "573026604210"; 

// Inicialización del SDK de EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// Estado Global del Carrito de Compras
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCartEvents();
    initNewsletterForm();
});

/* 1. Animaciones al hacer Scroll */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

/* 2. Controladores del Carrito Sidebar */
function initCartEvents() {
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');

    cartToggle.addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.add('open');
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);
}

function closeCartSidebar() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
}

/* 3. Agregar Productos al Carrito */
function addToCart(title, price) {
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ title, price, quantity: 1 });
    }
    updateCartUI();
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('active');
}

/* 4. Actualizar Interfaz del Carrito */
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">El carrito está vacío</p>';
        cartCount.textContent = '0';
        cartTotal.textContent = '$0 COP';
        return;
    }

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        const el = document.createElement('div');
        el.style.display = 'flex';
        el.style.justifyContent = 'space-between';
        el.style.alignItems = 'center';
        el.style.marginBottom = '1rem';
        el.style.paddingBottom = '0.8rem';
        el.style.borderBottom = '1px solid #F0F0F0';
        
        el.innerHTML = `
            <div>
                <h4 style="font-size:0.95rem; color:#2C1810;">${item.title}</h4>
                <small style="color:#666;">$${item.price.toLocaleString('es-CO')} x ${item.quantity}</small>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <strong style="color:#2C1810;">$${(item.price * item.quantity).toLocaleString('es-CO')}</strong>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:1.1rem;"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
        cartItems.appendChild(el);
    });

    cartCount.textContent = count;
    cartTotal.textContent = `$${total.toLocaleString('es-CO')} COP`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

/* 5. Modal de Checkout WhatsApp */
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Por favor agrega al menos un producto al carrito antes de comprar.');
        return;
    }
    closeCartSidebar();
    document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('open');
}

/* 6. Envío del Pedido a WhatsApp */
function sendOrderToWhatsApp(e) {
    e.preventDefault();

    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const address = document.getElementById('orderAddress').value;
    const notes = document.getElementById('orderNotes').value || 'Ninguna';

    // Generar la lista de productos
    let orderDetails = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderDetails += `• *${item.title}* x${item.quantity} - $${itemTotal.toLocaleString('es-CO')} COP%0A`;
    });

    /* 
       [PERSONALIZACIÓN DE MENSAJE]
       Puedes modificar las palabras del mensaje a continuación si deseas cambiar cómo se lee el ticket en WhatsApp:
    */
    let message = `*¡NUEVO PEDIDO DE CAFÉ VERALTO!* ☕%0A%0A`;
    message += `*Cliente:* ${name}%0A`;
    message += `*Teléfono:* ${phone}%0A`;
    message += `*Dirección:* ${address}%0A`;
    message += `*Observaciones:* ${notes}%0A%0A`;
    message += `*DETALLE DE LA COMPRA:*%0A${orderDetails}%0A`;
    message += `*TOTAL A PAGAR:* $${total.toLocaleString('es-CO')} COP%0A%0A`;
    message += `_Enviado desde el sitio web de Café Veralto_`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE_NUMBER}&text=${message}`;

    // Abrir enlace de WhatsApp en una pestaña nueva
    window.open(whatsappUrl, '_blank');

    // Limpiar formulario y carrito
    cart = [];
    updateCartUI();
    closeCheckoutModal();
}

/* 7. Envío de Correo Real con EmailJS */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const msg = document.getElementById('newsletterMsg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('custName').value;
        const email = document.getElementById('custEmail').value;

        msg.style.color = 'var(--accent-gold)';
        msg.textContent = 'Enviando registro y mensaje de bienvenida...';

        /*
           [VARIABLES DEL PLANTILLA DE EMAILJS]
           Estas variables coinciden con los tags configurados en tu plantilla (Ej: {{user_name}}, {{user_email}}):
        */
        const templateParams = {
            user_name: name,
            user_email: email,
            to_name: name,
            to_email: email,
            message: "¡Bienvenido a la comunidad de Café Veralto! Cosechado en Curití, Santander."
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                msg.style.color = '#27ae60';
                msg.textContent = `¡Registro exitoso! Correo de bienvenida enviado a ${email}.`;
                form.reset();
            })
            .catch((error) => {
                console.error('Error EmailJS:', error);
                msg.style.color = '#e74c3c';
                msg.textContent = 'Hubo un error al procesar el correo. Intenta de nuevo.';
            });
    });
}