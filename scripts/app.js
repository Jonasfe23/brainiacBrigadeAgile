import apiModule from "./apiModule.js";
import { login, register, userOrAdmin } from "./logInModule.js";
import { getMenu, getUsers} from "./localStorageModule.js";

window.addEventListener(`DOMContentLoaded`, () => {
    usersToStorage();
    menuToStorage();

    if (document.location.pathname.endsWith("login.html")) {
        initLogin();
    }
    if (document.location.pathname.endsWith("register.html")) {
        initRegistration();
    }
    if (document.location.pathname.endsWith("ProductPage.html")) {
        populateMenu();
        userOrAdmin();
    }
})


async function usersToStorage() {

    try {  

        let users = getUsers();
        
        if (users.length < 1){
            const data = await apiModule.getData(`https://santosnr6.github.io/Data/airbeanusers.json`);
            data.users.forEach(user => {
                users.push(user)
            })
        } 

        localStorage.setItem(`users`, JSON.stringify(users));
        
    } catch (error) {
        console.log(`Something went wrong at usersToStorage ` + error);
    }   
}


async function menuToStorage() {

    try {

        let menu = getMenu();

        if (menu.length < 1) {
            const data = await apiModule.getData(`https://santosnr6.github.io/Data/airbeanproducts.json`);
            data.menu.forEach(coffee => {
                menu.push(coffee)
            })
        }

        localStorage.setItem(`menu`, JSON.stringify(menu));
        
    } catch (error) {
        console.log(`Something went wrong at menuToStorage ` + error);
    }

}


function populateMenu() {
    try {
        const menu = getMenu();

        const menuContainerRef = document.querySelector(`#menuList`);

        menu.forEach(coffee => {
            const menuItemContainerRef = document.createElement(`li`);
            menuItemContainerRef.classList.add(`menu-list__list-item`)

            const buyButtonRef = document.createElement(`img`);
            buyButtonRef.classList.add(`menu-list__add-button`)
            buyButtonRef.src = '../Assets/add.svg'
            // sendToCart existerar inte än 
            // buyButtonRef.addEventListener(`click` sendToCart); 
            menuItemContainerRef.appendChild(buyButtonRef);

            const coffeeInfoWrapperRef = document.createElement(`div`);
            coffeeInfoWrapperRef.classList.add(`menu-list__info-wrapper`);

            const coffeeTitleRef = document.createElement(`h3`);
            coffeeTitleRef.classList.add(`menu-list__coffe-title`)
            coffeeTitleRef.textContent = coffee.title;

            coffeeInfoWrapperRef.appendChild(coffeeTitleRef);

            const coffeeDescriptionRef = document.createElement(`p`);
            coffeeDescriptionRef.classList.add(`menu-list__about-coffee`)
            coffeeDescriptionRef.textContent = coffee.desc;

            coffeeInfoWrapperRef.appendChild(coffeeDescriptionRef);

            menuItemContainerRef.appendChild(coffeeInfoWrapperRef)

            const coffeePriceRef = document.createElement(`p`);
            coffeePriceRef.classList.add(`menu-list__price`);
            coffeePriceRef.textContent = `${coffee.price} kr`;

            menuItemContainerRef.appendChild(coffeePriceRef);

            menuContainerRef.appendChild(menuItemContainerRef);
        });


    } catch (error) {
        console.log(`Error at populateMenu ` + error);
    }
}

function initLogin () {
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const gdprCheckbox = document.querySelector('input[name="gdpr"]');

        if (!gdprCheckbox.checked) {
            alert('Du måste godkänna GDPR för att fortsätta.');
            return;
        }

        const user = login(username, password);

        if (user) {
            console.log('Välkommen till Airbean-familjen, ' + user.username + '!');
            window.location.href = 'ProductPage.html'; 
        } else {
            alert('Felaktigt användarnamn eller lösenord. Försök igen.');
        }
    });
}

function initRegistration () {
    const registerForm = document.querySelector('#registerForm');

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const regUsername = document.querySelector('input[name="regUsername"]').value;
        const regPassword = document.querySelector('input[name="regPassword"]').value;
        const regConfirmPassword = document.querySelector('input[name="regConfirmPassword"]').value;

        if (regPassword !== regConfirmPassword) {
            alert('The passwords do not match. Please try again.');
            return;
        }
        register(regUsername, regPassword);
    });
}











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


