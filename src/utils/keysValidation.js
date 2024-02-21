/*
* Recebe como parâmetro um objeto e um array de strings.
* Compra se todas as keys do objeto estão presente no array de strings.
*/

const keysValidation = (objeto, expectedKeys) => {

    // Cria um novo objeto com as keys trimadas
    const trimmedObject = Object.keys(objeto).reduce((acc, key) => {
        acc[key.trim()] = objeto[key];
        return acc;
    }, {});

    const keys = Object.keys(trimmedObject);

    const validKeys = expectedKeys.length === keys.length && expectedKeys.every(key => keys.includes(key));
    
    return validKeys;

};

export {
    keysValidation
}