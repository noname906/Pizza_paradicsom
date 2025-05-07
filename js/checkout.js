// Rendelés leadásához szükséges funkciók
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ellenőrizzük, hogy a kosár nem üres
            if (cart.length === 0) {
                alert('A kosár üres. Kérjük, adjon hozzá termékeket a rendeléshez!');
                window.location.href = 'menu.html';
                return;
            }
            
            // Összegyűjtjük a form adatokat
            const formData = {
                name: document.getElementById('name').value,
                address: document.getElementById('address').value,
                phone: document.getElementById('phone').value,
                notes: document.getElementById('notes').value,
                payment: document.querySelector('input[name="payment"]:checked').value,
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
            
            // Itt küldenénk el a rendelést a szerver felé
            // Mivel most csak frontend-et készítünk, szimulálunk egy sikeres rendelést
            
            // Rendelési adatok mentése localStorage-ba (demo célból)
            localStorage.setItem('lastOrder', JSON.stringify(formData));
            
            // Kosár ürítése
            clearCart();
            
            // Köszönőüzenet megjelenítése és átirányítás
            alert('Köszönjük a rendelést! A rendelését feldolgozzuk és hamarosan szállítjuk.');
            window.location.href = 'index.html';
        });
    }
});