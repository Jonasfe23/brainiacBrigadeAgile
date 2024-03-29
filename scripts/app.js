import apiModule from "./apiModule.js";
import { login, register, userOrAdmin } from "./logInModule.js";
import { getMenu, getUsers, getCart, getOrders } from "./localStorageModule.js";

window.addEventListener(`DOMContentLoaded`, () => {


    if (document.location.pathname.endsWith("index.html")) {
        usersToStorage();
        menuToStorage();
    }
    if (document.location.pathname.endsWith("login.html")) {
        usersToStorage();
        initLogin();
        addCloseButton();
    }
    if (document.location.pathname.endsWith("register.html")) {
        usersToStorage();
        initRegistration();
        addCloseButton();
    }
    if (document.location.pathname.endsWith("ProductPage.html")) {
        menuToStorage();
        document.querySelector(`#orderButton`).addEventListener(`click`, createOrder);
        populateMenu();
        renderCart();
        userOrAdmin();
        addCloseButton();
    }
    if (document.location.pathname.endsWith("profile.html")) {
        usersToStorage();
        const editProfileBtn = document.getElementById('editProfileBtn');
        const editFormContainer = document.getElementById('editFormContainer');

        editProfileBtn.addEventListener('click', () => {
        editFormContainer.style.display = 'block';

        })
        renderOrderHistory();
        openEditForm()
        updateProfile();
        addCloseButton();
    }
    if (document.location.pathname.endsWith("aboutUs.html")) {
        addCloseButton();
    }
    if (document.location.pathname.endsWith("statusPage.html")){
        document.querySelector(`#statusButton`).addEventListener(`click`, () => {
            window.location.href = "ProductPage.html"
        })
        startCountdown();
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
        hideLoadingIndicator();

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

            const menuItemButtonRef = document.createElement(`button`);
            menuItemButtonRef.classList.add(`menu-list__button`, `menu-list__button--add`);
            menuItemButtonRef.dataset.id = coffee.id;
            menuItemButtonRef.dataset.title = coffee.title;
            menuItemButtonRef.ariaLabel = `Lägg till ${menuItemButtonRef.dataset.title} i din varukorg`;
            menuItemButtonRef.addEventListener(`click`, sendToCart);

            menuItemContainerRef.appendChild(menuItemButtonRef);

            const coffeeInfoWrapperRef = document.createElement(`div`);
            coffeeInfoWrapperRef.classList.add(`menu-list__info-wrapper`);

            const coffeeTitleRef = document.createElement(`h2`);
            coffeeTitleRef.classList.add(`menu-list__coffe-title`)
            coffeeTitleRef.textContent = coffee.title;

            coffeeInfoWrapperRef.appendChild(coffeeTitleRef);

            const coffeeDescriptionRef = document.createElement(`p`);
            coffeeDescriptionRef.classList.add(`menu-list__about-coffee`)
            coffeeDescriptionRef.textContent = coffee.desc;

            coffeeInfoWrapperRef.appendChild(coffeeDescriptionRef);

            menuItemContainerRef.appendChild(coffeeInfoWrapperRef)

            const coffeePriceRef = document.createElement(`h3`);
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
        renderCart();

    } catch (error) {
        console.log(`Something went wrong at sendToCart:` + error);
    }
}

function removeFromCart(event) {

    let clickedItem = event.currentTarget.dataset.id;
    clickedItem = parseInt(clickedItem);

    const cart = getCart();

    const existingCartItem = cart.findIndex(itemInCart => itemInCart.id === clickedItem);

    if (existingCartItem !== -1) {
    cart[existingCartItem].amount--
    cart[existingCartItem].sum = cart[existingCartItem].price * cart[existingCartItem].amount;
   
        if (cart[existingCartItem].amount === 0) {
            cart.splice(existingCartItem, 1);
            
            if(cart.length < 1) {
                document.querySelector(`#cart`).classList.add(`d-none`)
            }
        }

        localStorage.setItem(`cart`, JSON.stringify(cart));
        renderCart();
        
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
            button.ariaLabel = `Ta bort ${button.dataset.title} från menyn.`
            button.removeEventListener(`click`, sendToCart);
            button.addEventListener(`click`, removeFromMenu);
        } else {
            button.ariaLabel = `Lägg till ${button.dataset.title} i din varukorg`
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

function renderCart() {

    try {
        const cartListRef = document.querySelector(`#cartList`);

        cartListRef.innerHTML = ``;

        let cartPrice = 0;
        let itemsInCart = 0;

        const cart = getCart();


        cart.forEach(menuItem => {

            const cartListItemRef = document.createElement(`li`);
            cartListItemRef.classList.add(`cart__item`);

            const cartWrapperLeftRef = document.createElement(`div`);
            cartWrapperLeftRef.classList.add(`cart__item-inner-left`);
            cartListItemRef.appendChild(cartWrapperLeftRef);

            const cartItemTitleRef = document.createElement(`h4`);
            cartItemTitleRef.textContent = menuItem.title;
            cartWrapperLeftRef.appendChild(cartItemTitleRef);

            const cartItemPriceRef = document.createElement(`p`);
            cartItemPriceRef.classList.add(`cart__item-price`);
            cartItemPriceRef.textContent = `${menuItem.sum} kr`;
            cartPrice += menuItem.sum;
            cartWrapperLeftRef.appendChild(cartItemPriceRef);

            const cartWrapperRightRef = document.createElement(`div`);
            cartWrapperRightRef.classList.add(`cart__item-inner-right`);
            cartListItemRef.appendChild(cartWrapperRightRef);

            const upIconRef = document.createElement(`i`);
            upIconRef.classList.add(`fa-solid`, `fa-chevron-up`);
            upIconRef.dataset.id = menuItem.id;
            upIconRef.addEventListener(`click`, sendToCart);
            cartWrapperRightRef.appendChild(upIconRef);

            const menuItemAmountRef = document.createElement(`span`);
            menuItemAmountRef.textContent = menuItem.amount;
            itemsInCart += menuItem.amount;
            cartWrapperRightRef.appendChild(menuItemAmountRef);

            const downIconRef = document.createElement(`i`);
            downIconRef.classList.add(`fa-solid`, `fa-chevron-down`);
            downIconRef.dataset.id = menuItem.id;
            downIconRef.addEventListener(`click`, removeFromCart);
            cartWrapperRightRef.appendChild(downIconRef);

            cartListRef.appendChild(cartListItemRef);
        });

        const itemsInCartRef = document.querySelector(`#itemsInCart`);
        const cartButtonRef = document.querySelector(`#cartIcon`);

        if (cart.length === 0) {
            itemsInCartRef.classList.add(`d-none`);
            cartButtonRef.removeEventListener(`click`, showCart);
            cartButtonRef.classList.remove(`header__cart-icon--clickable`);
            localStorage.removeItem(`cart`);
        } else {
            itemsInCartRef.classList.remove(`d-none`);
            cartButtonRef.addEventListener(`click`, showCart);
            cartButtonRef.classList.add(`header__cart-icon--clickable`);
        }

        itemsInCartRef.textContent = itemsInCart;
        document.querySelector(`#cartPrice`).textContent = `${cartPrice} kr`;
        
    } catch (error) {

        console.log(`Something went wrong at renderCart: ` + error);
    }

}

function showCart() {
    document.querySelector(`#cart`).classList.toggle(`d-none`);
}

function createOrder() {

    try {
        const cart = getCart();
        const orders = getOrders();
        const orderNumber = String(orders.length + 1).padStart(13, '0');

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Padstart så att om det är färre än 2 siffror så läggs 0 framför. 01 ist för 1 alltså. +1 pga att javaScript räknar månader från 0...
        const day = String(today.getDate()).padStart(2, '0');


        const date = `${year}/${month}/${day}`
    
        const loggedInUser = JSON.parse(localStorage.getItem(`loggedInUser`));
    
        const newOrder = {
            ordernumber: orderNumber,
            date: date,
            customer: loggedInUser.username,
            order: cart
        }
    
        orders.push(newOrder);
    
        localStorage.setItem(`orders`, JSON.stringify(orders));
        localStorage.removeItem(`cart`);
        localStorage.removeItem(`countDownTime`);
        localStorage.setItem(`activeOrder`, true);
        document.querySelector(`#cart`).classList.add(`d-none`);
        window.location.href = "statusPage.html";

    } catch (error) {
        console.log(`Something went wrong at createOrder: ` + error);
    }

}

function renderOrderHistory() {

    const orders = getOrders();
    const loggedInUser = JSON.parse(localStorage.getItem(`loggedInUser`));

    const orderHistory = orders.filter(order => order.customer === loggedInUser.username);

    const listWrapperRef = document.querySelector(`#orderHistoryList`);

    const totalSpentRef = document.querySelector(`#totalSpent`);
    let totalSpent = 0; 

    orderHistory.forEach(order => {

        const listItemRef = document.createElement(`li`);
        listItemRef.classList.add(`orderhistory__list-item`);

        const orderNumberRef = document.createElement(`h4`);
        orderNumberRef.classList.add(`orderhistory__ordernumber`);
        orderNumberRef.textContent = `#${order.ordernumber}`;

        const orderDateRef = document.createElement(`p`);
        orderDateRef.classList.add(`orderhistory__date`);
        orderDateRef.textContent = order.date;

        const orderTotalRef = document.createElement(`p`);
        orderTotalRef.classList.add(`orderhistory__tot-amount`);
        orderTotalRef.textContent = `total ordersumma:`;

        const orderPriceRef = document.createElement(`p`);
        orderPriceRef.classList.add(`orderhistory__price`);

        let priceOfOrder = 0;
              
        
        order.order.forEach(itemOnOrder => {
            priceOfOrder += itemOnOrder.sum;
            totalSpent += itemOnOrder.sum;
        });

        orderPriceRef.textContent = `${priceOfOrder} kr`;
        totalSpentRef.textContent = `${totalSpent} kr`

        listItemRef.appendChild(orderNumberRef);
        listItemRef.appendChild(orderDateRef);
        listItemRef.appendChild(orderDateRef);
        listItemRef.appendChild(orderTotalRef);
        listItemRef.appendChild(orderPriceRef);

        listWrapperRef.appendChild(listItemRef);

    });
}

function addCloseButton() {
    const openMenuBtn = document.getElementById('openMenuBtn');
    const menu = document.querySelector('.header__menu');

    let closeMenuBtn = document.getElementById('closeMenuBtn');
    if (!closeMenuBtn) {
        closeMenuBtn = document.createElement('button');
        closeMenuBtn.className = 'header__hamburger__close-menu';
        closeMenuBtn.id = 'closeMenuBtn';
        menu.appendChild(closeMenuBtn);

        closeMenuBtn.setAttribute('aria-label', 'Close menu');

        closeMenuBtn.addEventListener('click', () => {
            menu.style.display = 'none';
            openMenuBtn.style.display = 'block';
        });
    }

    openMenuBtn.addEventListener('click', () => {
        menu.style.display = 'block';
        openMenuBtn.style.display = 'none';
    });
}

function hideLoadingIndicator() {
    const loadingIndicatorRef = document.querySelector(`#loadingIndicator`);
    if (loadingIndicatorRef && !loadingIndicatorRef.classList.contains(`d-none`)) {
        loadingIndicatorRef.classList.add(`d-none`);
    }
}

function updateProfile(newUsername, newEmail, newProfileImg) {
    // Hämta den inloggade användaren från localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const profileImg = document.getElementById('profileImg');
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');

    // Kolla om det finns en inloggad användare
    if (loggedInUser) {
        // Hämta URL för antingen den nya eller befinliga bilden
        const profileImgUrl = newProfileImg || loggedInUser.profile_image || '';
        
        if(profileImgUrl && profileImgUrl.trim() !== '') {
            profileImg.src = profileImgUrl;
            profileImg.alt = 'Profilbild';
        } else {
            profileImg.src = './Assets/profile.svg'; // Om ingen profilbild finns, använd en default
            profileImg.alt = 'Default profile image';
        }
        
        // Uppdatera usernameElement innehåll med det nya eller befintliga användarnamnet
        if (newUsername !== undefined) {
            usernameElement.textContent = newUsername;
        } else {
            usernameElement.textContent = loggedInUser.username;
        }
        
        // Uppdatera emailElementets innehåll med den nya eller befintliga mailen
        if (newEmail !== undefined) {
            emailElement.textContent = newEmail;
        } else {
            emailElement.textContent = loggedInUser.email;
        }

    } else {
        // Om ingen användare är inloggad
        profileImg.src = './Assets/profile.svg';
        profileImg.alt = 'Default profile image';

        usernameElement.textContent = 'Gäst';
        emailElement.textContent = '';
    }
}

// Denna funktion aktiveras när användaren skickar formuläret för att ändra på användarinformaitonen
function openEditForm() {
    const editForm = document.getElementById('editForm');

    editForm.addEventListener('submit', function (event){
        event.preventDefault();

        // Hämta de nya användaruppgifterna från formuläret
        const newUsername = document.getElementById('newUsername').value;
        const newEmail = document.getElementById('newEmail').value;
        const newPassword = document.getElementById('newPassword').value;
        const newProfileImg = document.getElementById('newProfileImg').value;

        updateUserInfo(newUsername, newEmail, newPassword, newProfileImg);
        
    });
}

// Denna funktion uppdaterar användarinformationen i localStorage och det som syns på sidan baserat på de nya uppgifterna
function updateUserInfo(newUsername, newEmail, newPassword, newProfileImg) {
    
    // Hämta användarlistan från localStorage och konvertera den till ett array-objekt
    let users = JSON.parse(localStorage.getItem('users'));
    
    // Hämta den inloggade användaren från localStorage och spara den i en variabel
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loggedInUsername = loggedInUser.username;
    
    // Hitta indexet för det inloggade användaren i användarlistan
    const loggedInUserIndex = users.findIndex(user => user.username === loggedInUsername);

    // Kolla om användaren finns i listan
    if (loggedInUserIndex !== -1) {
        
        // Kolla om det nya användarnamnet redan används
        if (newUsername && newUsername !== loggedInUsername) {
            const usernameExists = users.some(user => user.username === newUsername);
            if (usernameExists) {
                alert('Användarnamnet är uppdaget. Vänligen välj något annat tack.');
                return;
            }
        }
        
        // Uppdatera användarinformationen om något av fälten fylls i
        if (newUsername !== undefined || newEmail !== undefined || newPassword || newProfileImg) {
            
            if (newUsername !== undefined && newUsername !== '') {
                users[loggedInUserIndex].username = newUsername;
                localStorage.setItem('loggedInUser', JSON.stringify(users[loggedInUserIndex]));
                updateProfile(newUsername);
                document.getElementById('username').textContent = newUsername;
            } else {
                newUsername = loggedInUser.username;
            }
            if (newEmail !== undefined && newEmail !== '') {
                users[loggedInUserIndex].email = newEmail;
                localStorage.setItem('loggedInUser', JSON.stringify(users[loggedInUserIndex]));
                updateProfile(newEmail);
                document.getElementById('email').textContent = newEmail;
            } else {
                newEmail = loggedInUser.email;
            }
            if (newPassword) {
                users[loggedInUserIndex].password = newPassword;
            }
            if (newProfileImg) {
                users[loggedInUserIndex].profile_image = newProfileImg;
                localStorage.setItem('loggedInUser', JSON.stringify(users[loggedInUserIndex]));
                updateProfile(newProfileImg);
            }
        
            // Spara den uppdaterade användarlistan till localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Uppdatera profilsidan med den nya användarinformationen
            updateProfile(newUsername, newEmail, newProfileImg);

            alert('Ändringar sparade!');

            // Dölj formuläret efter sparade ändringar
            const editFormContainer = document.getElementById('editFormContainer');
            editFormContainer.style.display = 'none';

        }  

    } else {
        alert('Användaren hittdes inte.');
    }
}





    //Timer
   // Funktion för att starta nedräkningen
function startCountdown() {
    // Kontrollera om det finns en sparad tid i localStorage
    let activeOrder = localStorage.getItem(`activeOrder`);
    var savedTime = localStorage.getItem("countDownTime");

    if (activeOrder) {
        // Om det finns en sparad tid, starta nedräkningen med den sparade tiden
        if (savedTime) {
            countDown(savedTime);
        } else {
            // Annars starta en ny nedräkning med 8 minuter
            var now = new Date().getTime();
            var futureTime = now + 1 * 60 * 1000; // Tid om 8 minuter
            countDown(futureTime);
        }
    } else {
        document.querySelector(`#statusTitle`).textContent = `Inget att spåra!`
    }
}

// Funktion för nedräkningen
function countDown(targetTime) {

    let orders = getOrders();
    let loggedInUser = JSON.parse(localStorage.getItem(`loggedInUser`));
    let customersOrders = orders.filter(order => order.customer === loggedInUser.username);
    let latestOrder = customersOrders.length - 1;

    var x = setInterval(function() {
        // Hämta nuvarande tid
        var now = new Date().getTime();

        // Beräkna återstående tid i millisekunder
        var distance = targetTime - now;

        // Beräkna minuter och sekunder från millisekunder
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Visa kvarvarande tid
        let orderNumberRef = document.querySelector(`#ordernummer`);
        let tidRef = document.querySelector(`#tid`);
        let statusRef = document.querySelector(`#statusTitle`);
        orderNumberRef.textContent = `Ordernummer #${customersOrders[latestOrder].ordernumber}`;
        statusRef.textContent = `Din beställning är på väg!`
        tidRef.innerHTML = minutes + " min " + seconds + " sek kvar";

        // Om tiden har gått ut, visa "EXPIRED" och rensa localStorage
        if (distance <= 0) {
            clearInterval(x);
            statusRef.textContent = ``
            tidRef.innerHTML = "Framme!";
            orderNumberRef.textContent = ``;
            localStorage.removeItem("countDownTime");
            localStorage.removeItem("activeOrder");
        }
    }, 1000);

    // Spara måltiden i localStorage för att fortsätta nedräkningen efter siduppdateringar
    localStorage.setItem("countDownTime", targetTime);
}

// Starta nedräkningen när sidan laddas


