
export function getMenu() {
    try {
        const menuString = localStorage.getItem(`menu`) || JSON.stringify([]);
        const menu = JSON.parse(menuString);
        return menu;

    } catch (error) {
        console.log(`Something went wrong at getMenu ` + error);
        return [];
    }
}

export function getUsers() {

    try {
        const usersString = localStorage.getItem(`users`) || JSON.stringify([]);
        const users = JSON.parse(usersString);
        return users;

    } catch (error) {
        console.log(`Something went wrong at getUsers` + error);
        return [];
    }
}




