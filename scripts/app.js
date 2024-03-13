import apiModule from "./apiModule.js";
import localStorageModule from "./localStorageModule.js";

window.addEventListener(`DOMContentLoaded`, () => {
    menuToStorage()
    usersToStorage()
})

async function menuToStorage() {

    try {

        let menu = localStorageModule.getMenu();
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/airbeanproducts.json`);
        const checkForDuplicate = menu.some(menuItem => menuItem.name === data.menu.name);

        if (!checkForDuplicate && menu.length < 1) {
            data.menu.forEach(coffee => {
                menu.push(coffee)
            })
        }

        localStorage.setItem(`menu`, JSON.stringify(menu));

    } catch (error) {
        console.log(`Something went wrong at menuToStorage ` + error);
    }
}

async function usersToStorage() {

    try {

        let users = localStorageModule.getUsers();
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/airbeanusers.json`);
        const checkForDuplicate = users.some(user => user.name === data.users.name);

        if (!checkForDuplicate && users.length < 1) {
            data.users.forEach(user => {
                users.push(user)
            })
        }

        localStorage.setItem(`users`, JSON.stringify(users));

    } catch (error) {
        console.log(`Something went wrong at usersToStorage ` + error);
    }
}

async function register(regUsername, regPassword) {
    try {

        let localUsers = localStorageModule.getUsers();

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

        localStorageModule.saveUser(newUser);

        alert('Registration was successful!');

        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error during registration:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
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
});