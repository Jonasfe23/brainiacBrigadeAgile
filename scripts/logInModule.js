//funcLogin

import { getUsers } from './localStorageModule.js';

export async function login(username, password) {
    try {
        const users = getUsers();

        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            return user;
        } else {
            throw new Error('Felaktigt användarnamn eller lösenord.');
        }
    } catch (error) {
        console.error('Fel vid inloggning:', error.message);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const gdprCheckbox = document.querySelector('input[name="gdpr"]');

        if (!gdprCheckbox.checked) {
            alert('Du måste godkänna GDPR för att fortsätta.');
            return;
        }

        const user = await login(username, password);

        if (user) {
            console.log('Välkommen till Airbean-familjen, ' + user.username + '!');
            //window.location.href = 'profil.html'; 
        } else {
            alert('Felaktigt användarnamn eller lösenord. Försök igen.');
        }
    });
});
