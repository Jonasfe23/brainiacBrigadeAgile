import apiModule from "./apiModule.js";
import { getMenu, getUsers} from "./localStorageModule.js";



window.addEventListener(`DOMContentLoaded`, ()=> {
    usersToStorage();
    menuToStorage();

    
    if (document.location.pathname.endsWith("ProductPage.html")) {
        populateMenu();
    }
})




async function usersToStorage () {

    try {  

        let users = getUsers();
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/airbeanusers.json`);
        const checkForDuplicate = users.some(user => user.name === data.users.name);
        
        if (!checkForDuplicate && users.length < 1){
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
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/airbeanproducts.json`);
        const checkForDuplicate = menu.some(menuItem => menuItem.name === data.menu.name);
        
        if (!checkForDuplicate && menu.length < 1){
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
