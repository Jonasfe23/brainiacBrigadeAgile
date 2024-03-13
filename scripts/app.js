import apiModule from "./apiModule.js";

import { getMenu, getUsers, saveUser} from "./localStorageModule.js";

window.addEventListener(`DOMContentLoaded`, () => {
    usersToStorage();
    menuToStorage();

    if (document.location.pathname.endsWith("register.html")) {

        const registerForm = document.querySelector('#registerForm');
        console.log(registerForm);
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
    if (document.location.pathname.endsWith("ProductPage.html")) {
        populateMenu();
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
            const coffeeWrapperRef = document.createElement(`li`);
            coffeeWrapperRef.classList.add(`menu-list__list-item`)

            const buyButtonRef = document.createElement(`img`);
            buyButtonRef.classList.add(`menu-list__add-button`)
            // sendToCart existerar inte än 
            // buyButtonRef.addEventListener(`click` sendToCart); 
            buyButtonRef.src = '../Assets/add.svg'
            coffeeWrapperRef.appendChild(buyButtonRef);

            const coffeeTitleRef = document.createElement(`h3`);
            coffeeTitleRef.classList.add(`menu-list__coffe-title`)
            coffeeTitleRef.textContent = coffee.title;
            coffeeWrapperRef.appendChild(coffeeTitleRef);

            const coffeePriceRef = document.createElement(`p`);
            coffeePriceRef.classList.add(`menu-list__price`);
            coffeePriceRef.textContent = `${coffee.price} kr`;
            coffeeWrapperRef.appendChild(coffeePriceRef);

            const coffeeDescriptionRef = document.createElement(`p`);
            coffeeDescriptionRef.classList.add(`menu-list__about-coffee`)
            coffeeDescriptionRef.textContent = coffee.desc;
            coffeeWrapperRef.appendChild(coffeeDescriptionRef);

            menuContainerRef.appendChild(coffeeWrapperRef);

        });


    } catch (error) {
        console.log(`Error at populateMenu ` + error);
    }
} 

async function register(regUsername, regPassword) {
    try {

        let localUsers = getUsers();

        const externalUserData = await apiModule.getData(`https://santosnr6.github.io/Data/airbeanusers.json`);
        const externalUsers = externalUserData.users;

        const existingLocalUser = localUsers.find(user => user.regUsername === regUsername);
        if (existingLocalUser) {
            alert('Username already exists.');
            return;
        }

        const existingExternalUser = externalUsers.find(user => user.regUsername === regUsername);
        if (existingExternalUser) {
            alert('Username already exists.');
            return;
        }

        const gdprCheckbox = document.querySelector('input[name="gdpr"]');
        if (!gdprCheckbox.checked) {
            alert('You must agree to GDPR to continue.');
            return;
        }

        const newUser = {
            regUsername: regUsername,
            regPassword: regPassword
        };

        localUsers.push(newUser);

        saveUser(newUser);

        alert('Registration was successful!');

        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error during registration:', error.message);
    }
}
