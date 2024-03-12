//funcLogin

async function login(username, password) {
    try {
        const response = await fetch('https://santosnr6.github.io/Data/airbeanusers.json');

        if (!response.ok) {
            throw new Error('Problem med att hämta info: ' + response.status);
        }

        const users = (await response.json())?.users;
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            console.log('Inloggning lyckades:', user);
            return user;
        } else {
            throw new Error('Felaktigt användarnamn eller lösenord.');
        }
    } catch (error) {
        console.error('Fel vid inloggning:', error.message);
        return null;
    }
}

export default login

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
        window.location.href = 'profil.html'; 
    } else {
        alert('Felaktigt användarnamn eller lösenord. Försök igen.');
    }
});
