function bigCart() {

    document.addEventListener('DOMContentLoaded', function () {
        const cartIcon = document.querySelector('.cart-icon');
        const productpageCart = document.querySelector('.productpage__cart');
        const menuList = document.getElementById('menuList');
        const cartList = document.querySelector('.productpage__cart-list');

        // Gör kundkorgen osynlig när sidan laddas för första gången
        productpageCart.style.display = 'none';

        // Toggle varukorgen när kundvagnsikonen klickas på
        cartIcon.addEventListener('click', function () {
            productpageCart.style.display = (productpageCart.style.display === 'none') ? 'flex' : 'none';
        });

        // Lägg till händelselyssnare på menyn för att lägga till produkter i varukorgen
        menuList.addEventListener('click', function (event) {
            if (event.target.classList.contains('menu-list__add-button')) {
                const menuItem = event.target.closest('.menu-list__list-item');
                const title = menuItem.querySelector('.menu-list__coffe-title').textContent;
                const price = parseFloat(menuItem.querySelector('.menu-list__price').textContent);

                // Kolla om produkten redan finns i varukorgen
                const existingCartItem = Array.from(cartList.children).find(item => {
                    const itemTitle = item.querySelector('.productpage__cart-item-title').textContent;
                    return itemTitle === title;
                });

                // Om produkten redan finns, öka bara antalet
                if (existingCartItem) {
                    const quantitySpan = existingCartItem.querySelector('.productpage__cart-item-quantity span');
                    let quantity = parseInt(quantitySpan.textContent);
                    quantity++;
                    quantitySpan.textContent = quantity;
                } else { // Annars lägg till en ny produkt i varukorgen
                    const cartItem = document.createElement('li');
                    cartItem.classList.add('productpage__cart-item');
                    cartItem.innerHTML = `
                    <div class="productpage__cart-item-inner-left">
                        <h4 class="productpage__cart-item-title">${title}</h4>
                        <p class="productpage__cart-item-price">${price} kr</p>
                    </div>
                    <div class="productpage__cart-item-inner-right">
                        <div class="productpage__cart-item-quantity">
                            <button class="productpage__cart-decrease">-</button>
                            <span>1</span>
                            <button class="productpage__cart-increase">+</button>
                        </div>
                    </div>
                `;
                    cartList.appendChild(cartItem);
                }

                renderTotalPrice();
            }
        });

        // Lägg till händelselyssnare för att öka och minska antalet produkter i varukorgen
        cartList.addEventListener('click', function (event) {
            const target = event.target;
            const cartItem = target.closest('.productpage__cart-item');
            if (!cartItem) return;

            const quantitySpan = cartItem.querySelector('.productpage__cart-item-quantity span');
            let quantity = parseInt(quantitySpan.textContent);

            if (target.classList.contains('productpage__cart-decrease')) {
                if (quantity > 1) {
                    quantity--;
                    quantitySpan.textContent = quantity;
                } else {
                    // Om antalet är 0, ta bort produkten från kundkorgen
                    cartList.removeChild(cartItem);
                }
            } else if (target.classList.contains('productpage__cart-increase')) {
                quantity++;
                quantitySpan.textContent = quantity;
            }

            renderTotalPrice();
        });

        // Funktion för att rendera totalpriset
        function renderTotalPrice() {
            const cartItems = document.querySelectorAll('.productpage__cart-item');
            let totalPrice = 0;

            cartItems.forEach(cartItem => {
                const price = parseFloat(cartItem.querySelector('.productpage__cart-item-price').textContent);
                const quantity = parseInt(cartItem.querySelector('.productpage__cart-item-quantity span').textContent);
                totalPrice += price * quantity;
            });

            const totalPriceElement = document.querySelector('.productpage__price');
            totalPriceElement.textContent = `${totalPrice.toFixed(2)} kr`;
        }
    });
}