import apiModule from "./apiModule.js";
import localStorageModule from "./localStorageModule.js";
import logInModule from "./logInModule.js";

window.addEventListener(`DOMContentLoaded`, ()=> {
    menuToStorage()
    usersToStorage()
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
    }   
}

async function usersToStorage () {

    try {  

        let users = localStorageModule.getUsers();
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