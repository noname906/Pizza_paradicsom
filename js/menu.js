// Menü megjelenítése és szűrése
document.addEventListener('DOMContentLoaded', function() {
    const pizzaContainer = document.getElementById('pizza-container');
    const filterButtons = document.querySelectorAll('.filter-button');
    
    // Pizza kártyák létrehozása és megjelenítése
    function displayPizzas(pizzas) {
        pizzaContainer.innerHTML = '';
        
        pizzas.forEach(pizza => {
            const pizzaCard = document.createElement('div');
            pizzaCard.className = 'pizza-card';
            
            // Alapértelmezett méret
            const defaultSize = 'medium';
            
            pizzaCard.innerHTML = `
                <img src="${pizza.image}" alt="${pizza.name}" onerror="this.src='img/default-pizza.jpg'">
                <div class="pizza-details">
                    <h3>${pizza.name}</h3>
                    <p>${pizza.description}</p>
                    <p class="price">${pizza.prices[defaultSize]} Ft</p>
                    <div class="sizes">
                        <input type="radio" id="small-${pizza.id}" name="size-${pizza.id}" value="small">
                        <label for="small-${pizza.id}">28 cm</label>
                        
                        <input type="radio" id="medium-${pizza.id}" name="size-${pizza.id}" value="medium" checked>
                        <label for="medium-${pizza.id}">32 cm</label>
                        
                        <input type="radio" id="large-${pizza.id}" name="size-${pizza.id}" value="large">
                        <label for="large-${pizza.id}">45 cm</label>
                    </div>
                    <button class="add-to-cart" data-id="${pizza.id}">Kosárba</button>
                </div>
            `;
            
            pizzaContainer.appendChild(pizzaCard);
            
            // Méret változtatás esemény
            const sizeInputs = pizzaCard.querySelectorAll('input[type="radio"]');
            sizeInputs.forEach(input => {
                input.addEventListener('change', function() {
                    const selectedSize = this.value;
                    const priceElement = pizzaCard.querySelector('.price');
                    priceElement.textContent = `${pizza.prices[selectedSize]} Ft`;
                });
            });
            
            // Kosárba gomb eseménykezelő
            const addToCartButton = pizzaCard.querySelector('.add-to-cart');
            addToCartButton.addEventListener('click', function() {
                const selectedSize = pizzaCard.querySelector('input[type="radio"]:checked').value;
                addToCart(pizza, selectedSize);
            });
        });
    }
    
    // Szűrő gombok eseménykezelői
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Aktív gomb stílusának beállítása
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Pizzák szűrése
            let filteredPizzas;
            if (category === 'all') {
                filteredPizzas = pizzaData;
            } else {
                filteredPizzas = pizzaData.filter(pizza => pizza.category === category);
            }
            
            displayPizzas(filteredPizzas);
        });
    });
    
    // Kezdetben az összes pizza megjelenítése
    displayPizzas(pizzaData);
});