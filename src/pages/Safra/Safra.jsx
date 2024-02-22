import "./Safra.css";
import { csvRead } from "../../utils/csvRead";
import { keysValidation } from "../../utils/keysValidation"; // Supondo que você mova isso para um util
import { useEffect, useState } from "react";
import PrimaryButton from "../../components/Button/PrimaryButton";

function Safra() {

    const [sales, setSales] = useState([]);

    const expectedKeys = [
        "AAAAMM",
        "AUTORI",
        "CRT ESTRANG",
        "DATA VENDA",
        "EC",
        "HORA",
        "MODALIDADE",
        "NCAR",
        "NSU",
        "PL",
        "PRODUTO",
        "T",
        "TAXA ADMN",
        "TERMINAL",
        "VALOR BRUTO",
        "VALOR LIQUIDO"
    ];

    const handleClick = () => {
        document.getElementById("file-select").click();
    };

    const fileRead = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {
            const data = await csvRead(file, { header: true, skipEmptyLines: true });

            const validData = data.every(data => keysValidation(data, expectedKeys));

            if (!validData) {
                console.error("Erro: As chaves do objeto não correspondem ao esperado.");
            } else {
                setSales(data);
            }

        } catch (error) {
            console.error("Erro ao processar o arquivo:", error);
        }
    };

    useEffect(() => {
        console.log(sales);
    }, [sales]);

    return (
        <div className="safra-window">
            <div className="tittle-bar">
                <h1>Conciliador de cartões Safra</h1>
            </div>
            <div className="buttons-bar">
                <input id="file-select" className="file-select" type="file" accept=".csv" onChange={fileRead} />
                <PrimaryButton text="Importar Vendas" onClick={handleClick} />
            </div>

        </div>
    );
}

export default Safra;
