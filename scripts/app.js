import apiModule from "./apiModule.js";
import { login, register, userOrAdmin } from "./logInModule.js";
import { getMenu, getUsers, getCart } from "./localStorageModule.js";

window.addEventListener(`DOMContentLoaded`, () => {
    usersToStorage();
    menuToStorage();

    if (document.location.pathname.endsWith("login.html")) {
        initLogin();
        addCloseButton(); 
    }
    if (document.location.pathname.endsWith("register.html")) {
        initRegistration();
        addCloseButton(); 
    }
    if (document.location.pathname.endsWith("ProductPage.html")) {
        document.querySelector(`#cartIcon`).addEventListener(`click`, () => {
            document.querySelector(`.productpage__cart`).classList.toggle(`d-none`);
        }) 
        
        populateMenu();
        userOrAdmin();
        addCloseButton(); 
    }
    
})


async function usersToStorage() {

    try {

        let users = getUsers();

        if (users.length < 1) {
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
        menuContainerRef.innerHTML = ``;

        menu.forEach(coffee => {
            const menuItemContainerRef = document.createElement(`li`);
            menuItemContainerRef.classList.add(`menu-list__list-item`)

            const menuItemButtonRef = document.createElement(`img`);
            menuItemButtonRef.classList.add(`menu-list__button`, `menu-list__button--add`);
            menuItemButtonRef.src = '../Assets/add.svg';
            menuItemButtonRef.alt = "Button to add item to cart";
            menuItemButtonRef.dataset.id = coffee.id;
            menuItemButtonRef.addEventListener(`click`, sendToCart);

            menuItemContainerRef.appendChild(menuItemButtonRef);

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



function sendToCart(event) {

    try {
        let clickedItem = event.currentTarget.dataset.id;
        clickedItem = parseInt(clickedItem);

        const menu = getMenu();

        const itemToBuy = menu.find(itemToCart => itemToCart.id === clickedItem);

        const cart = getCart();

        const newCartItem = {
            amount: 1,
            id: itemToBuy.id,
            price: itemToBuy.price,
            sum: itemToBuy.price,
            title: itemToBuy.title
        };

        if (cart.some(itemInCart => itemInCart.id === itemToBuy.id)) {
            const existingCartItem = cart.findIndex(itemInCart => itemInCart.id === itemToBuy.id);
            cart[existingCartItem].amount++;
            cart[existingCartItem].sum = cart[existingCartItem].price * cart[existingCartItem].amount;
        } else {
            cart.push(newCartItem);
        }

        localStorage.setItem(`cart`, JSON.stringify(cart));

    } catch (error) {
        console.log(`Something went wrong at sendToCart:` + error);
    }
}

export function editMenuToggle() {

    const editMenuButtonRef = document.querySelector(`#editButton`);
    editMenuButtonRef.classList.toggle(`edit-menu__button--red`);
    const editMenuForm = document.querySelector(`#menuForm`);

    editMenuForm.classList.toggle(`d-none`);

    if (document.querySelector(`.edit-menu__button--red`)) {
        editMenuButtonRef.textContent = `Avbryt`;
        editMenuForm.addEventListener(`submit`, addToMenu);
    }
    else {
        editMenuButtonRef.textContent = `Redigera meny`;
        editMenuForm.removeEventListener(`submit`, addToMenu);
    }

    const menuItemButtons = document.querySelectorAll(`.menu-list__button`);
    menuItemButtons.forEach(button => {
        button.classList.toggle(`menu-list__button--remove`);
        button.classList.toggle(`menu-list__button--add`);

        if (button.classList.contains(`menu-list__button--remove`)) {
            button.src = `../Assets/remove.svg`;
            button.alt = `Button to remove items from menu`
            button.removeEventListener(`click`, sendToCart);
            button.addEventListener(`click`, removeFromMenu);
        } else {
            button.src = `../Assets/add.svg`;
            button.alt = "Button to add item to cart";
            button.removeEventListener(`click`, removeFromMenu);
            button.addEventListener(`click`, sendToCart);
        }
    });
}

function removeFromMenu(event) {

    let menu = getMenu();
    let itemToRemove = event.currentTarget.dataset.id;
    itemToRemove = parseInt(itemToRemove);

    menu = menu.filter(menuItem => menuItem.id !== itemToRemove);

    localStorage.setItem(`menu`, JSON.stringify(menu));

    editMenuToggle();
    populateMenu();
}

function addToMenu(event) {

    event.preventDefault();
    try {
        const titleInputRef = document.querySelector(`#editName`);
        const priceInputRef = document.querySelector(`#editPrice`);
        const shortDescInputRef = document.querySelector(`#shortDesc`);
        let longDescInputRef = document.querySelector(`#longDesc`);
        let pictureInputRef = document.querySelector(`#editPic`);

        if (longDescInputRef.value.length < 1) {
            longDescInputRef.value = `n/a`;
        }

        if (pictureInputRef.value.length < 1) {
            pictureInputRef.value = `n/a`;
        }

        const menu = getMenu();

        const newId = menu[menu.length - 1].id + 1;

        const newMenuItem = {
            id: newId,
            title: titleInputRef.value,
            desc: shortDescInputRef.value,
            longer_desc: longDescInputRef.value,
            price: parseInt(priceInputRef.value),
            rating: `n/a`,
            image: pictureInputRef.value
        };

        const alreadyOnMenu = menu.some(menuItem => menuItem.title.toLowerCase() === newMenuItem.title.toLowerCase());

        if (alreadyOnMenu) {

            alert(`${newMenuItem.title.toUpperCase()}, finns redan på menyn. Ta bort den gamla först.`);

        } else {

            menu.push(newMenuItem);

            localStorage.setItem(`menu`, JSON.stringify(menu));

            this.reset();

            editMenuToggle();
            populateMenu();
        }
    } catch (error) {
        console.log(`Something went wrong at addToMenu: ` + error);
    }
}

function initLogin() {
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

function initRegistration() {
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

function addCloseButton() {
    const openMenuBtn = document.getElementById('openMenuBtn');
    const menu = document.querySelector('.header__menu');

    // Skapa stängningsknappen om den inte redan existerar
    let closeMenuBtn = document.getElementById('closeMenuBtn');
    if (!closeMenuBtn) {
        closeMenuBtn = document.createElement('button');
        closeMenuBtn.className = 'header__hamburger__close-menu';
        closeMenuBtn.id = 'closeMenuBtn';
        menu.appendChild(closeMenuBtn);

        // Hantera klick på stängningsknappen
        closeMenuBtn.addEventListener('click', () => {
            menu.style.display = 'none';
            openMenuBtn.style.display = 'block';
        });
    }

    // Lägg till logik för att öppna menyn när användaren klickar på öppningsknappen
    openMenuBtn.addEventListener('click', () => {
        menu.style.display = 'block';
        openMenuBtn.style.display = 'none'; // Dölj öppningsknappen när menyn är synlig
    });
}