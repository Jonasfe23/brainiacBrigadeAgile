import apiModule from "./apiModule.js";
import { login, register, userOrAdmin } from "./logInModule.js";
import { getMenu, getUsers} from "./localStorageModule.js";

window.addEventListener(`DOMContentLoaded`, () => {
    usersToStorage();
    menuToStorage();

    // OBS: TA BORT RAD 9 TILL 13! Endast för att utveckla admin func
    // if (document.location.pathname.endsWith("index.html")) {
    //    window.location.href = 'ProductPage.html';
    //    populateMenu();
    // }
    if (document.location.pathname.endsWith("login.html")) {
        initLogin();
    }
    if (document.location.pathname.endsWith("register.html")) {
        initRegistration();
    }
    if (document.location.pathname.endsWith("ProductPage.html")) {
        document.querySelector(`.cart-icon`).addEventListener(`click`, () => {
            document.querySelector(`.productpage__cart`).classList.toggle(`d-none`);
        })
        
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
        menuContainerRef.innerHTML = ``;

        menu.forEach(coffee => {
            const menuItemContainerRef = document.createElement(`li`);
            menuItemContainerRef.classList.add(`menu-list__list-item`)

            const menuItemButtonRef = document.createElement(`img`);
            menuItemButtonRef.classList.add(`menu-list__button`, `menu-list__button--add`);
            menuItemButtonRef.src = '../Assets/add.svg';
            menuItemButtonRef.alt = "Button to add item to cart";
            menuItemButtonRef.dataset.coffee = coffee.title;
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

export function editMenuToggle () {
    const editMenuButtonRef = document.querySelector(`.edit-menu-btn`);
    editMenuButtonRef.classList.toggle(`edit-menu-btn--red`);

    if (document.querySelector(`.edit-menu-btn--red`)) {
        editMenuButtonRef.textContent = `Avbryt`;
    }
    else {
        editMenuButtonRef.textContent = `Redigera meny`;
    }

    const menuItemButtons = document.querySelectorAll(`.menu-list__button`);
    menuItemButtons.forEach(button=> {
        button.classList.toggle(`menu-list__button--remove`);
        button.classList.toggle(`menu-list__button--add`);
            
        if (button.classList.contains(`menu-list__button--remove`)) {
            button.src = `../Assets/remove.svg`;
            button.alt = `Button to remove items from menu`
            button.removeEventListener(`click`, sendToCart);
            button.addEventListener(`click`,removeFromMenu);
        } else {
            button.src = `../Assets/add.svg`;
            button.alt = "Button to add item to cart";
            button.removeEventListener(`click`, removeFromMenu);
            button.addEventListener(`click`, sendToCart);
        }
    });
}

function sendToCart (event) {
    const itemToBuy = event.currentTarget.dataset.coffee;
    console.log(`sendToCart: ` + itemToBuy);
}

function removeFromMenu(event) {
    let menu = getMenu();

    const itemToRemove = event.currentTarget.dataset.coffee;

    menu = menu.filter(menuItem => menuItem.title !== itemToRemove);

    localStorage.setItem(`menu`, JSON.stringify(menu));
    editMenuToggle();
    populateMenu();
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


