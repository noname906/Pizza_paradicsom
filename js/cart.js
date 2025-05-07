// Kosár funkciók
let cart = [];

// Kosár betöltése localStorage-ból
function loadCart() {
    const savedCart = localStorage.getItem('pizzaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        
        // Kosár oldal elemek frissítése, ha a kosár oldalon vagyunk
        if (window.location.pathname.includes('cart.html')) {
            displayCartItems();
        }
        
        // Checkout oldal frissítése, ha a checkout oldalon vagyunk
        if (window.location.pathname.includes('checkout.html')) {
            updateOrderSummary();
        }
    }
}

// Kosár mentése localStorage-ba
function saveCart() {
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
}

// Kosár elem számának frissítése a fejlécben
function updateCartCount() {
    // Az összes potenciális elem frissítése
    const cartCountElements = [
        document.getElementById('cart-item-count'),
        document.getElementById('cart-item-count-menu'),
        document.getElementById('cart-item-count-cart'),
        document.getElementById('cart-item-count-checkout')
    ];
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
        }
    });
}

// Termék hozzáadása a kosárhoz
function addToCart(pizza, size) {
    // Ellenőrizzük, hogy a termék már szerepel-e a kosárban
    const existingItemIndex = cart.findIndex(item => 
        item.id === pizza.id && item.size === size
    );
    
    if (existingItemIndex !== -1) {
        // Ha már a kosárban van, növeljük a mennyiséget
        cart[existingItemIndex].quantity += 1;
    } else {
        // Ha még nincs a kosárban, hozzáadjuk
        cart.push({
            id: pizza.id,
            name: pizza.name,
            price: pizza.prices[size],
            size: size,
            quantity: 1,
            image: pizza.image
        });
    }
    
    // Frissítjük a kosarat és mentjük
    updateCartCount();
    saveCart();
    
    // Értesítés megjelenítése
    alert(`${pizza.name} (${size}) hozzáadva a kosárhoz!`);
}

// Kosár elemek megjelenítése a kosár oldalon
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        // Ha üres a kosár
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        if (cartTotalElement) {
            cartTotalElement.textContent = '0 Ft';
        }
        return;
    }
    
    // Elrejtjük az "üres kosár" üzenetet
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }
    
    // Kosár elemek HTML létrehozása
    let cartHTML = '<div class="cart-items-list">';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='img/default-pizza.jpg'">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Méret: ${getSizeText(item.size)}</p>
                    <p>Ár: ${item.price} Ft</p>
                    <div class="quantity-control">
                        <button class="decrease-quantity" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <p>${itemTotal} Ft</p>
                    <button class="remove-item" data-index="${index}">Törlés</button>
                </div>
            </div>
        `;
    });
    
    cartHTML += '</div>';
    
    // Frissítjük a kosár tartalmát és az összeget
    cartItemsContainer.innerHTML = cartHTML;
    if (cartTotalElement) {
        cartTotalElement.textContent = `${total} Ft`;
    }
    
    // Eseménykezelők a kosár elemekhez
    attachCartEventListeners();
}

// Mérethez tartozó szöveg
function getSizeText(size) {
    switch(size) {
        case 'small': return '28 cm';
        case 'medium': return '32 cm';
        case 'large': return '45 cm';
        default: return size;
    }
}

// Kosár eseménykezelők csatolása
function attachCartEventListeners() {
    // Mennyiség csökkentése
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            displayCartItems();
            updateCartCount();
        });
    });
    
    // Mennyiség növelése
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart[index].quantity += 1;
            saveCart();
            displayCartItems();
            updateCartCount();
        });
    });
    
    // Elem törlése
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            saveCart();
            displayCartItems();
            updateCartCount();
        });
    });
}

// Rendelés összesítő frissítése a checkout oldalon
function updateOrderSummary() {
    const orderSummaryElement = document.getElementById('order-summary');
    const totalPriceElement = document.getElementById('total-price-checkout');
    
    if (!orderSummaryElement || !totalPriceElement) {
        return;
    }
    
    let summaryHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        summaryHTML += `
            <div class="order-item">
                <p>${item.name} (${getSizeText(item.size)}) x ${item.quantity}</p>
                <p>${itemTotal} Ft</p>
            </div>
        `;
    });
    
    orderSummaryElement.innerHTML = summaryHTML;
    totalPriceElement.textContent = `Összesen: ${total} Ft`;
}

// Kosár ürítése
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

// Oldal betöltésekor inicializáljuk a kosarat
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Pizza slider a főoldalon
    const slider = document.querySelector('.slider');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    
    if (slider && prevButton && nextButton) {
        let slideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        
        // Kezdőállapot beállítása
        updateSlider();
        
        prevButton.addEventListener('click', function() {
            slideIndex = (slideIndex > 0) ? slideIndex - 1 : slides.length - 1;
            updateSlider();
        });
        
        nextButton.addEventListener('click', function() {
            slideIndex = (slideIndex < slides.length - 1) ? slideIndex + 1 : 0;
            updateSlider();
        });
        
        function updateSlider() {
            slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        }
    }
});