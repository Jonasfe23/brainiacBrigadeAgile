
function getMenu() {
    try {
        const menuString = localStorage.getItem(`menu`) || JSON.stringify([]);
        const menu = JSON.parse(menuString);
        return menu;

    } catch (error) {
        console.log(`Something went wrong at getMenu ` + error);
        return [];
    }
}

export default {getMenu}