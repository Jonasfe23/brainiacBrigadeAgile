import apiModule from "./apiModule.js";
import localStorageModule from "./localStorageModule.js";

window.addEventListener(`DOMContentLoaded`, ()=> {
    menuToStorage ()
})

async function menuToStorage () {

    try {  

        let menu = localStorageModule.getMenu();
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
}}