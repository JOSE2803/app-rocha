import "./Conciliation.css";
import propTypes from 'prop-types';
import SaleProduct from "../SaleProduct/SaleProduct.jsx";
import { format, addDays } from 'date-fns';
import formatCurrency from "../../../../utils/formatCurrency.js";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import Installments from "../Installments/Installments.jsx";

function Conciliation({ sale }) {

    const [installmentContents, setInstallmentContents] = useState([]);
    const [showOptions, setShowOptions] = useState(true);

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

    const defineInstallments = useCallback(() => {

        const contents = [];

        //Cartão de débito
        if (Installment === 0) {
            contents.push({
                conciliated: Conciliated ? true : false,
                installment: 1,
                value: GrossValue,
                dueDate: addDays(new Date(CreatedAt), 1)
            });
        } else {
            for (let i = 1; i <= Installment; i++) {
                contents.push({
                    conciliated: Conciliated ? true : false,
                    installment: i,
                    value: GrossValue / Installment,
                    dueDate: addDays(new Date(CreatedAt), i * 30)
                });
            }
        }

        setInstallmentContents(contents);

    }, [Installment, CreatedAt, GrossValue, Conciliated]);

    useEffect(() => {
        defineInstallments();
    }, [defineInstallments])

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
                {installmentContents.length && showOptions > 0 &&
                    <Installments
                        installmentContents={installmentContents}
                        setShowOptions={setShowOptions}
                    >
                    </Installments>
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
        Conciliated: propTypes.bool
    })
};

export default Conciliation;