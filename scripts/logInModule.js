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







 

document.addEventListener('DOMContentLoaded', async () => { 

    const loginForm = document.getElementById('loginForm'); 

     

    // Lyssnar på formulärets inlämning 

    loginForm.addEventListener('submit', async event => { 

        event.preventDefault(); // Förhindra standardbeteendet för formulär 

         

        // Hämtar användarnamn och lösenord från formuläret 

        const username = loginForm.querySelector('input[name="username"]').value; 

        const password = loginForm.querySelector('input[name="password"]').value; 

         

        try { 

            // Hämtar användarinformation från JSON-filen 

            const response = await fetch('https://santosnr6.github.io/Data/airbeanusers.json'); 

            const userData = await response.json(); 

             

            // Söker efter en matchande användare i användarlistan 

            const user = userData.users.find(user => user.username === username && user.password === password); 

             

            if (user) { 

                // Sparar användarnamnet i localStorage för att indikera att användaren är inloggad 

                localStorage.setItem('loggedInUser', username); 

                const userRole = user.role; 

                console.log('Användarroll:', userRole); 

                 

                if (userRole === 'admin') { 

                    // Visar redigeringsknappen för admin-användare 

                    const editMenuBtn = document.querySelector('.edit-menu-btn'); 

                    if (editMenuBtn) editMenuBtn.classList.remove('d-none'); 

                } 

            } else { 

                console.error('Fel användarnamn eller lösenord'); 

            } 

        } catch (error) { 

            console.error('Fel vid inloggning:', error); 

        } 

    }); 

}); 