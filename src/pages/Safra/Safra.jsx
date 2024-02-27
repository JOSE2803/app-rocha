import "./Safra.css";
import { csvRead } from "../../utils/csvRead";
import { keysValidation } from "../../utils/keysValidation"; // Supondo que você mova isso para um util
import { useEffect, useCallback, useState } from "react";
import PrimaryButton from "../../components/Button/PrimaryButton";
import CardSafra from "./components/CardSafra/CardSafra";
import axios from "axios";
import removeDuplicates from "../../utils/removeDuplicates.js";
import { format, parse } from 'date-fns';
import Modal from "../../components/Modal/Modal.jsx";

function Safra() {

    const [data, setData] = useState([]);
    const [sales, setSales] = useState([]);
    const [hasPosted, setHasPosted] = useState(true);
    const [showModal, setShowModal] = useState(false);

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

    const handleClickFilters = () => {
        setShowModal(!showModal);
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

    const fetchData = useCallback(async () => {

        const response = await axios.get(`http://localhost:3001/safra`);

        const result = response.data.data;

        setData((pre) => {
            const updateData = removeDuplicates([...pre, ...result], "Nsu");
            return updateData;
        });

        setHasPosted(false);

    }, []);

    const postData = useCallback(async () => {
        // Utiliza Promise.all para aguardar a conclusão de todas as promessas de postagem
        await Promise.all(sales.map(async (sale) => {
            const dateString = `${sale["DATA VENDA"].replace("'", "").trim()} ${sale.HORA.replace("'", "").replace(/\./g, ':').trim()}`;
            const date = parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date());

            const body = {
                CommercialPlace: sale.EC.replace("'", "").trim(),
                Terminal: sale.TERMINAL.replace("'", "").trim(),
                CreatedAt: format(date, "yyyyMMdd HH:mm:ss"),
                Installment: parseInt(sale.PL.replace("'", "")),
                Nsu: sale.NSU.replace("'", "").trim(),
                Product: sale.PRODUTO.replace("'", "").trim(),
                Modality: sale.MODALIDADE.replace("'", "").trim(),
                CardNumber: sale.NCAR.replace("'", "").trim(),
                GrossValue: parseFloat(sale["VALOR BRUTO"].replace("'", "").replace(",", ".")),
                Tax: parseFloat(sale["TAXA ADMN"].replace("'", "").replace(",", ".")),
                Autorization: sale.AUTORI.replace("'", "").trim(),
                ForeignCard: sale["CRT ESTRANG"].replace("'", "").trim() === "N" ? 0 : 1,
                NetValue: parseFloat(sale["VALOR LIQUIDO"].replace("'", "").replace(",", ".")),
                Conciliated: 0
            }

            // Aguarda pela conclusão desta requisição de postagem
            return axios.post(`http://localhost:3001/safra`, body);
        }));

        // Só atualiza o estado quando todas as postagens forem completadas
        setHasPosted(true);
    }, [sales]);

    useEffect(() => {

    }, [showModal])

    useEffect(() => {
        if (sales.length > 0) {
            setHasPosted(false);
            postData();
        }
    }, [sales, postData]);

    useEffect(() => {
        if (hasPosted) {
            fetchData();
        }
    }, [hasPosted, fetchData]);

    return (
        <div className="safra-window">
            <Modal activated={showModal} onClose={handleClickFilters}></Modal>
            <div className="tittle-bar">
                <h1>Safra Cartões</h1>
            </div>
            <div className="buttons-bar">
                <input id="file-select" className="file-select" type="file" accept=".csv" onChange={fileRead} />
                <PrimaryButton text="Vendas" onClick={handleClick} />
                <PrimaryButton text="Recebimentos" onClick={handleClick} />
                <PrimaryButton text="Filtros" onClick={handleClickFilters} />
            </div>
            <div className="items">
                {data.length > 0 &&

                    data.map((el) => (
                        <CardSafra key={el.Nsu} sale={el} />
                    ))}
            </div>


        </div>
    );
}

export default Safra;
