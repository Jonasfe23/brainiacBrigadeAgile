//funcLogin

import { getUsers } from './localStorageModule.js';

export default async function login(username, password) {
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

const usernameInput = document.querySelector('input[name="username"]');
const passwordInput = document.querySelector('input[name="password"]');
const loginForm = document.querySelector('form');
const gdprCheckbox = document.querySelector('input[name="gdpr"]');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;
    
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




