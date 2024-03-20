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
import { toast } from 'react-toastify';
import axios from "axios";

function Conciliation({ sale, setShowModal,showModal }) {

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

    const handleSaveConciliation = useCallback(async () => {

        try {
            const allConciliateds = installmentContents.every(item => item.conciliated === true);

            if (!allConciliateds) {
                toastError("Há conciliações pendentes");
                return;
            }
    
            const params = {
                "Nsu": Nsu,
                "Conciliated": 1
            };
    
            await axios.put(`${import.meta.env.VITE_API_URL}/safra`, params);
    
            setData((current) => {
                return current.map((item) => {
                    return item.Nsu === Nsu
                        ? { ...item, Conciliated: true }
                        : item
                });
            });
    
            setShowModal(false);
        } catch (error) {
            toastError("Falha ao salvar informações.")
        }



    }, [Nsu, installmentContents, setShowModal, setData]);

    const defineInstallments = useCallback(async () => {

        try {
            const params = {
                startNsu: Nsu,
                endNsu: Nsu
            };
    
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts-receivable`, { params });
   
            const contents = [];
    
            //Cartão de débito
            if (Installment === 0) {

                contents.push({
                    conciliated: false,
                    installment: 1,
                    value: GrossValue,
                    dueDate: addDays(new Date(CreatedAt), 1),
                    recno: 0,
                    nsu: Nsu
                });
            } else {
                for (let i = 1; i <= Installment; i++) {
                    contents.push({
                        conciliated: false,
                        installment: i,
                        value: GrossValue / Installment,
                        dueDate: addDays(new Date(CreatedAt), i * 31),
                        recno: 0,
                        nsu: Nsu
                    });
                }
            }

            const updateContents = contents.map((item) => {
                const existInstallment = response.data.data.some(obj => obj.E1_ZNUMPRC == item.installment);

                if (existInstallment) {
                    const recno = response.data.data.find(obj => obj.E1_ZNUMPRC == item.installment).R_E_C_N_O_;
                    return {...item, conciliated: true, recno: recno}
                }

                return item;
            });
    
            setInstallmentContents(updateContents);

        } catch (error) {
            setShowModal(false);
            toastError("Falha ao obter informações.")
        }

        

    }, [Installment, CreatedAt, GrossValue, setInstallmentContents, Nsu, setShowModal]);

    useEffect(() => {
        defineInstallments();
    }, [defineInstallments])

    //remove da memoria a conciliação
    useEffect(() =>{
        return ()=>{
            const allConciliateds = installmentContents.every(item => item.conciliated === true);

            if(!allConciliateds){
                setData((current) => {
                    return current.map((item) => {
                        return item.Nsu === Nsu
                            ? { ...item, Conciliated: false }
                            : item
                    });
                });
            }           
        }
    },[showModal,setData,Nsu,installmentContents])

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
    }),
    setShowModal: propTypes.func,
    showModal: propTypes.bool
};

export default Conciliation;