import propTypes from 'prop-types';
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import { groupReceiptsByBranch } from './utils';
import { toast } from 'react-toastify';
import Spinner from '../../../../components/Spinner/Spinner';
import formatCurrency from "../../../../utils/formatCurrency.js";
import { format } from 'date-fns';
import axios from "axios";

import "./Receipts.css";
import { useState } from 'react';

function Receipts({ receipts }) {

    const [data, setData] = useState([]);
    const [sumOfReceipts, setSumOfReceipts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmptyData, setIsEmptyData] = useState(false);

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

    //Retorna a data selecionada já formatada em data.
    const selectReceiptDate = () => {

        let selectedDate = document.querySelector(".receipt-date").value;

        if (selectedDate) {
            selectedDate = new Date(`${selectedDate}T00:00:00`)
        }

        return selectedDate;

    };

    //Efetuar as baixas
    const registryOfReceipt = async () => {

        const id = toast.loading("Aguarde...");

        const allReceipts = [];

        for (const item of sumOfReceipts) {

            const branch = item.filial.trim();
            const receiptsByBranch = data[branch];

            receiptsByBranch.map((item) => {

                allReceipts.push(item);

            });
        }

        // Utiliza Promise.all para aguardar a conclusão de todas as promessas de postagem
        const result = await Promise.all(allReceipts.map(async (receipt) => {

            const recno = receipt.data[0].R_E_C_N_O_;

            const params = {
                "E1_ZBXSAFR": format(receipt.receiptDate, "yyyyMMdd")
            };

            try {
                await axios.put(`${import.meta.env.VITE_API_URL}/accounts-receivable/${recno}`, params);
                return { "success": true };
            } catch (error) {
                return { "success": false, "message": error.message };
            }
        }));

        const allSuccess = result.every(item => item.success === true);

        if (allSuccess) {
            toastUpdate(id, "Recebimentos atualizados, finalizar baixas pelo Protheus.", "success");            
        } else {
            toastUpdate(id, "Um ou mais recebimentos não foram atualizados.", "error");
        }

    };

    const getData = async () => {

        const selectedReceiptDate = selectReceiptDate();

        if (!selectedReceiptDate) {
            toastError("Nenhuma data selecionada!");
            return;
        }

        setIsLoading(true);

        const result = await groupReceiptsByBranch(receipts, selectedReceiptDate);

        if (!result || result.length <= 0) {
            setIsEmptyData(true);
        } else {
            await groupedByBranch(result);
            setIsEmptyData(false);
        }

        setIsLoading(false);
        setIsLoaded(true);

    };

    //Retonar um objeto agrupado por filial desde que o "type" seja "success".
    const groupedByBranch = async (result) => {

        const receiptsByBranch = await result.reduce((acc, item) => {

            if (item.type.trim() === "success") {
                const branchValue = item.data[0].E1_FILIAL;

                acc[branchValue] = acc[branchValue] || [];
                acc[branchValue].push(item);
            }

            return acc;
        }, {});

        const groupedArray = Object.entries(receiptsByBranch).map(([filial, items]) => {
            const total = items.reduce((acc, item) => {
                acc.grossValueReceived += item.grossValueReceived;
                acc.netValueReceived += item.netValueReceived;
                acc.E1_SALDO += item.data[0].E1_SALDO;
                return acc;
            }, { filial: filial, grossValueReceived: 0, netValueReceived: 0, E1_SALDO: 0 });

            return total;
        });

        setData(receiptsByBranch);
        setSumOfReceipts(groupedArray);

    };

    return (
        <div className="receipts">
            <div className="receipts-header">
                <h1>Recebimentos</h1>
                <div className="receipts-options">
                    <input type="date" className="receipt-date" />
                    <PrimaryButton text="Exibir" onClick={getData} />
                </div>
            </div>

            {/* Mostra um spinner enquanto estiver carregando os dados */}
            {isLoading &&
                <div className="receipts-loading-data">
                    <Spinner></Spinner>
                </div>
            }

            {/* Verifica se os dados fora carregados e se esta vazio */}
            {isLoaded && isEmptyData && !isLoading &&
                <div className="receipts-empty-data">
                    <h4 className="not-found-options">Nenhum resultado encontrado</h4>
                </div>
            }

            {/* Verifica se os dados fora carregados e se não esta vazio */}
            {isLoaded && !isEmptyData && !isLoading &&
                <div className="receipts-loaded-data">
                    {sumOfReceipts.map((item) => (
                        <div className="receipts-item-loaded-data" key={`${item.filial}`}>
                            <h5>{item.filial}</h5>
                            <h5>{`Safra: ${formatCurrency(item.grossValueReceived, "BRL")}`}</h5>
                            <h5>{`Taxa: ${formatCurrency(item.grossValueReceived - item.netValueReceived, "BRL")}`}</h5>
                            <h5>{`Protheus: ${formatCurrency(item.E1_SALDO, "BRL")}`}</h5>
                        </div>

                    ))}
                </div>
            }
            {isLoaded && !isEmptyData && !isLoading &&
                <div className="receipts-bottom">
                    <PrimaryButton text="Salvar" onClick={registryOfReceipt} />
                </div>
            }

        </div>

    );
}

Receipts.propTypes = {
    receipts: propTypes.arrayOf(
        propTypes.shape({
        })
    ),
};

export default Receipts;