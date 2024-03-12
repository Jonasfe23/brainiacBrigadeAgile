// Tar emot en url som sträng och returnerar en array med object.
async function getData (url) {

    try {
        const response = await fetch (url);
        const data = await response.json();
        return data

    } catch (error) {
        console.log(`Error at getData` + error);
        return null;
    }

}

export default {getData}