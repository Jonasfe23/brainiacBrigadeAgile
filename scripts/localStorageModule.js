
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

export function getCart() {

    try {
        const cartString = localStorage.getItem(`cart`) || JSON.stringify([]);
        const cart = JSON.parse(cartString);
        return cart;

    } catch (error) {
        console.log(`Something went wrong at getCart` + error);
        return [];
    }
}

export function saveUser(user) {
    try {
        
        let users = getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('User saved in localStorage:', user);
    } catch (error) {
        console.error('Something went wrong at localStorage:' + error);
    }
}

export function getOrders() {
    try {
        const ordersString = localStorage.getItem(`orders`) || JSON.stringify([]);
        const orders = JSON.parse(ordersString);
        return orders;

    } catch (error) {
        console.log(`Something went wrong at getOrders` + error);
        return [];
    }
}