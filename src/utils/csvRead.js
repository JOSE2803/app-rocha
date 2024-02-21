import Papa from "papaparse";

/*
 * Lê e analisa um arquivo CSV, retornando os dados como um array de objetos ajustados.
 * As chaves vazias são removidas dos objetos resultantes.
 * Esta função permite configuração customizada através do parâmetro options.
 */

const csvRead = async (file, options = {}) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            ...options, // Configurações customizadas.
            complete: ({ data }) => { // Desestruturação direta do resultado.
                const adjustedData = data.map(obj => (
                    Object.entries(obj).reduce((newObj, [key, value]) => {
                        if (key.trim()) { // Filtra chaves vazias.
                            newObj[key.trim()] = value; // Aproveita para trimar as chaves.
                        }
                        return newObj;
                    }, {})
                ));
                resolve(adjustedData);
            },
            error: (err) => reject(new Error(`Erro ao ler arquivo CSV: ${err.message}`)),
        });
    });
};

export { csvRead };
