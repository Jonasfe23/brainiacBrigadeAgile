import apiModule from "./apiModule.js";

window.addEventListener(`DOMContentLoaded`, () => {
    // Eventlystnare osv här inne.
    populateMenu()
})

async function populateMenu() {
    try {
        const data = await apiModule.getData(`https://santosnr6.github.io/Data/airbeanproducts.json`);
        const menu = data.menu;

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