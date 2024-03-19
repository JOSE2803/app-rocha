import "./Conciliation.css";
import propTypes from 'prop-types';
import SaleProduct from "../SaleProduct/SaleProduct.jsx";
import { format, addDays } from 'date-fns';
import formatCurrency from "../../../../utils/formatCurrency.js";
import { useContext, useEffect } from "react";
import { useCallback } from "react";
import Installments from "../Installments/Installments.jsx";
import { context } from "../../../../context/SafraContext/SafraContext.jsx";
import PrimaryButton from "../../../../components/Button/PrimaryButton.jsx";
import { ToastContainer, toast } from 'react-toastify';

function Conciliation({ sale, setShowModal }) {

    const {
        installmentContents,
        setInstallmentContents,
        showOptions,
        setShowOptions,
        setData
    } = useContext(context);

    const {
        Autorization,
        CreatedAt,
        CommercialPlace,
        Modality,
        CardNumber,
        Nsu,
        Installment,
        Product,
        Tax,
        Terminal,
        GrossValue,
        NetValue,
        Conciliated
    } = sale;

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

    /*const toastUpdate = (id, render, type) => {
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
    };*/

    const handleSaveConciliation = () => {

        const allConciliateds = installmentContents.every(item => item.conciliated === true);

        if (!allConciliateds) {
            toastError("Há conciliações pendentes");
            return;
        }

        setData((current) => {
            return current.map((item) => {
                return item.Nsu === Nsu
                    ? { ...item, Conciliated: true }
                    : item
            });
        });

        setShowModal(false);

    };

    const defineInstallments = useCallback(() => {

        //
        //
        //Chama API transendo todos os contas a receber com o NSU.
        //Abaixo verificar se já foi conciliado ou não
        //
        //

        const contents = [];

        //Cartão de débito
        if (Installment === 0) {
            contents.push({
                conciliated: Conciliated ? true : false,
                installment: 1,
                value: GrossValue,
                dueDate: addDays(new Date(CreatedAt), 1),
                recno: 0,
                nsu: Nsu
            });
        } else {
            for (let i = 1; i <= Installment; i++) {
                contents.push({
                    conciliated: Conciliated ? true : false,
                    installment: i,
                    value: GrossValue / Installment,
                    dueDate: addDays(new Date(CreatedAt), i * 31),
                    recno: 0,
                    nsu: Nsu
                });
            }
        }

        setInstallmentContents(contents);

    }, [Installment, CreatedAt, GrossValue, Conciliated, setInstallmentContents]);

    useEffect(() => {
        defineInstallments();
    }, [defineInstallments])

    useEffect(() => {

    }, [installmentContents])

    return (
        <div className="sale-conciliation">
            <div className="sale-header">
                <SaleProduct product={Product} />
                <div className="sale-infos">
                    <div className="sales-primary sales-values">
                        <p>
                            {formatCurrency(GrossValue, "BRL")}
                        </p>
                        <p>
                            Taxa: {parseFloat(Tax)}%
                            Valor líquido: {formatCurrency(parseFloat(NetValue), "BRL")}
                        </p>
                        <p>
                            {Modality.replace("'", "").trim()}
                            {parseInt(Installment) > 1 && ` (${parseInt(Installment)}X)`}
                        </p>
                    </div>
                    <div className="sales-secondary sales-values">
                        <p>
                            {Nsu}
                        </p>
                        <p>
                            {format(new Date(CreatedAt), "dd/MM/yyyy HH:mm:ss")}
                        </p>
                    </div>
                    <div className="sales-tertiary sales-values">
                        <p>
                            Loja: {CommercialPlace.replace("'", "").trim()} Terminal: {Terminal.replace("'", "").trim()}
                        </p>
                        <p>
                            Cartão: {CardNumber.replace("'", "").trim()} Autorização: {Autorization.replace("'", "").trim()}
                        </p>
                    </div>
                </div>
            </div>
            <div className="sale-installment">
                <Installments />
            </div>
            <div className="conciliation-buttons">
                {!showOptions &&
                    <PrimaryButton text="Salvar" onClick={handleSaveConciliation}/>
                }
                {showOptions &&
                    <PrimaryButton text="Voltar" onClick={() => setShowOptions(false)} />
                }
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

Conciliation.propTypes = {
    sale: propTypes.shape({
        Autorization: propTypes.string,
        CreatedAt: propTypes.string,
        CommercialPlace: propTypes.string,
        Modality: propTypes.string,
        CardNumber: propTypes.string,
        Nsu: propTypes.string,
        Installment: propTypes.number,
        Product: propTypes.string,
        Tax: propTypes.number,
        Terminal: propTypes.string,
        GrossValue: propTypes.number,
        NetValue: propTypes.number,
        Conciliated: propTypes.bool
    }),
    setShowModal: propTypes.func
};

export default Conciliation;