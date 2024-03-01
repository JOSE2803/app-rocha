import "./Safra.css";
import { csvRead } from "../../utils/csvRead";
import { keysValidation } from "../../utils/keysValidation"; // Supondo que você mova isso para um util
import { useEffect, useCallback, useState, useContext } from "react";
import PrimaryButton from "../../components/Button/PrimaryButton";
import CardSafra from "./components/CardSafra/CardSafra";
import axios from "axios";
import removeDuplicates from "../../utils/removeDuplicates.js";
import { format, parse } from 'date-fns';
import Modal from "../../components/Modal/Modal.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { context } from "../../context/SafraContext/SafraContext.jsx";

function Safra() {

    const { data, setData } = useContext(context);
    const [sales, setSales] = useState([]);
    const [hasPosted, setHasPosted] = useState(true);
    const [showModal, setShowModal] = useState(false);


    const handleSalesClick = () => {
        document.getElementById("file-select").click();
    };

    /*const toastSuccess = (message) => {
        toast.success(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };*/

    const toastError = (message) => {
        toast.error(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    const toastUpdate = (id, render, type) => {
        toast.update(id, {
            render,
            type,
            isLoading: false,
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    const handleClickFilters = () => {
        setShowModal(!showModal);
    };

    // Função para limpar os valores das propriedades
    const cleanValue = (value) => value.replace("'", "").trim().replace(",", ".");

    const fileRead = useCallback(async (e) => {

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

        const file = e.target.files[0];

        if (!file) {
            toastError("Arquivo inválido");
            return;
        }

        try {
            const data = await csvRead(file, { header: true, skipEmptyLines: true });

            const validData = data.every(data => keysValidation(data, expectedKeys));

            if (!validData || data.length <= 0) {
                toastError("Arquivo inválido");
            } else {
                setSales(data);
            }            

        } catch (error) {
            toastError("Erro inesperado");
        } finally {
            e.target.value = "";
        }

    }, []);

    const getSales = useCallback(async () => {

        const response = await axios.get(`http://localhost:3001/safra`);

        const result = response.data.data;

        setData((pre) => {
            const updateData = removeDuplicates([...pre, ...result], "Nsu");
            return updateData;
        });

        setHasPosted(false);

    }, []);

    const postSales = useCallback(async () => {        

        if (sales.length === 0) return;

        const id = toast.loading("Aguarde...");

        try {
            
            // Utiliza Promise.all para aguardar a conclusão de todas as promessas de postagem
            const result = await Promise.all(sales.map(async (sale) => {

                const {
                    EC: commercialPlace,
                    TERMINAL: terminal,
                    ["DATA VENDA"]: date,
                    HORA: hour,
                    PL: installment,
                    NSU: nsu,
                    PRODUTO: product,
                    MODALIDADE: modality,
                    NCAR: cardNumber,
                    ["VALOR BRUTO"]: grossValue,
                    ["TAXA ADMN"]: tax,
                    AUTORI: autorization,
                    ["CRT ESTRANG"]: foreignCard,
                    ["VALOR LIQUIDO"]: netValue
                } = sale;

                const params = {
                    startNsu: cleanValue(nsu),
                    endNsu: cleanValue(nsu)
                }

                //Faz um consulta para verificar se o Nsu já existe.
                const response = await axios.get(`http://localhost:3001/safra`, { params });

                //Finaliza em caso de status diferente de 200
                if (response.status !== 200) {
                    return { "success": false, "message": "Falaha ao verificar se Nsu já existe.", "nsu": cleanValue(nsu) };
                }

                //Finaliza caso o Nsu já existir.
                if (response.data && response.data.data.length > 0) {
                    return { "success": true, "message": "O NSU já existe", "nsu": cleanValue(nsu) };
                }

                const dateString = `${date.replace("'", "").trim()} ${hour.replace("'", "").replace(/\./g, ':').trim()}`;
                const dateParse = parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date());

                const formattedSale = {
                    CommercialPlace: cleanValue(commercialPlace),
                    Terminal: cleanValue(terminal),
                    CreatedAt: format(dateParse, "yyyyMMdd HH:mm:ss"),
                    Installment: parseInt(cleanValue(installment)),
                    Nsu: cleanValue(nsu),
                    Product: cleanValue(product),
                    Modality: cleanValue(modality),
                    CardNumber: cleanValue(cardNumber),
                    GrossValue: parseFloat(cleanValue(grossValue)),
                    Tax: parseFloat(cleanValue(tax)),
                    Autorization: cleanValue(autorization),
                    ForeignCard: cleanValue(foreignCard) === "N" ? 0 : 1,
                    NetValue: parseFloat(cleanValue(netValue)),
                    Conciliated: 0
                };

                // Aguarda pela conclusão desta requisição de postagem
                await axios.post(`http://localhost:3001/safra`, formattedSale);

                return { "success": true, "message": "Registro incluído com sucesso.", "nsu": cleanValue(nsu) };

            }));

            const allSuccess = result.every(item => item.success === true);

            if (allSuccess) {
                toastUpdate(id, "Vendas importadas com sucesso", "success");
            } else {
                toastUpdate(id, "Falha na importação", "error");
            }

            // Só atualiza o estado quando todas as postagens forem completadas
            setHasPosted(true);

        } catch (error) {
            toastUpdate(id, "Erro inesperado", "error");
            return;
        }

    }, [sales]);

    useEffect(() => {
        if (sales.length > 0) {
            setHasPosted(false);
            postSales();
        }
    }, [sales, postSales]);

    useEffect(() => {
        if (hasPosted) {
            getSales();
        }
    }, [hasPosted, getSales]);

    return (
        <div className="safra-window">
            <Modal activated={showModal} onClose={handleClickFilters}></Modal>
            <div className="tittle-bar">
                <h1>Safra Cartões</h1>
            </div>
            <div className="buttons-bar">
                <input id="file-select" className="file-select" type="file" accept=".csv" onChange={fileRead} />
                <PrimaryButton text="Vendas" onClick={handleSalesClick} />
                <PrimaryButton text="Recebimentos" onClick={handleSalesClick} />
                <PrimaryButton text="Filtros" onClick={handleClickFilters} />
            </div>
            <div className="items">
                {data.length > 0 &&

                    data.map((el) => (
                        <CardSafra key={el.Nsu} sale={el} />
                    ))}
            </div>
            <ToastContainer
                style={{ fontSize: "12px", maxWidth: "300px" }}
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition:Bounce
            />

        </div>
    );
}

export default Safra;
