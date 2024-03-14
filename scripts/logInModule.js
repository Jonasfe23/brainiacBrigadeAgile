//funcLogin

import { getUsers, saveUser} from './localStorageModule.js';

export function login(username, password) {
    try {
        const users = getUsers(); 
        
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {

            localStorage.setItem('loggedInUser', JSON.stringify(user)); 

            return user;
        } else {
            throw new Error('Felaktigt användarnamn eller lösenord.');
        }
    } catch (error) {
        console.error('Fel vid inloggning:', error.message);
        return null;
    }
}

export function register(regUsername, regPassword) {
    try {

        let localUsers = getUsers();

        const existingLocalUser = localUsers.find(user => user.username === regUsername);
        if (existingLocalUser) {
            alert('Username already exists.');
            return;
        }

        const gdprCheckbox = document.querySelector('input[name="gdpr"]');
        if (!gdprCheckbox.checked) {
            alert('You must agree to GDPR to continue.');
            return;
        }

        const newUser = {
            username: regUsername,
            password: regPassword,
            role: `user`
        };

        saveUser(newUser);

        alert('Registration was successful!');

        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error during registration:', error.message);
    }
}

export function userOrAdmin () {

    const loggedInUser = JSON.parse(localStorage.getItem(`loggedInUser`));

    if (loggedInUser) {

        if (loggedInUser.role === `admin`) {

            const editMenuBtn = document.querySelector(`.edit-menu-btn`);

            if (editMenuBtn) {
                editMenuBtn.classList.remove(`d-none`);
            } 
        }
    }
}