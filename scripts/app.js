import apiModule from "./apiModule.js";
import localStorageModule from "./localStorageModule.js";

window.addEventListener(`DOMContentLoaded`, () => {
    // Eventlystnare osv här inne.
    localStorageModule.getMenu;
    menuToStorage ()
    populateMenu()
})

async function menuToStorage () {

    try {  

        let menu = localStorageModule.getMenu();
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/airbeanproducts.json`);
        const checkForDuplicate = menu.some(menuItem => menuItem.name === data.menu.name);
        
        if (!checkForDuplicate){
            data.menu.forEach(coffee => {
                menu.push(coffee)
            })

        } else {
            
            menu = menu.filter(menu => menu !== data.menu);
        }

        localStorage.setItem(`menu`, JSON.stringify(menu));
        
    } catch (error) {
        console.log(`Something went wrong at menuToStorage ` + error);
}}



async function populateMenu() {
    try {
        const menu = localStorageModule.getMenu();

        const bodyRef = document.querySelector(`body`);

        menu.forEach(coffee => {
            const coffeeWrapperRef = document.createElement(`div`);

            const buyButtonRef = document.createElement(`button`);
            // sendToCart existerar inte än 
            // buyButtonRef.addEventListener(`click` sendToCart); 
            buyButtonRef.textContent = `+`;
            coffeeWrapperRef.appendChild(buyButtonRef);

            const coffeeTitleRef = document.createElement(`h3`);
            coffeeTitleRef.textContent = coffee.title;
            coffeeWrapperRef.appendChild(coffeeTitleRef);
            
            const coffeePriceRef = document.createElement(`p`);
            coffeePriceRef.textContent = `${coffee.price} kr`;
            coffeeWrapperRef.appendChild(coffeePriceRef);

            const coffeeDescriptionRef = document.createElement(`p`);
            coffeeDescriptionRef.textContent = coffee.desc;
            coffeeWrapperRef.appendChild(coffeeDescriptionRef);

            bodyRef.appendChild(coffeeWrapperRef);

        });
    
        
    } catch (error) {
        console.log(`Error at populateMenu ` + error);
    }
}