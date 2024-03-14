import "./Installments.css";
import { format, addDays, subDays } from 'date-fns';
import formatCurrency from "../../../../utils/formatCurrency.js";
import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import { context } from "../../../../context/SafraContext/SafraContext.jsx";
import { TiInputChecked, TiDelete } from "react-icons/ti";

function Installments() {

    const {
        installmentContents,
        setInstallmentContents,
        showOptions,
        setShowOptions,
    } = useContext(context);

    const [installment, setInstallment] = useState(null);
    const [options, setOptions] = useState([]);
    const [loadOptions, setLoadOptions] = useState(false);

    const handleClickOptions = async (el) => {

        setInstallment(el);
        setShowOptions(true);

    };

    const handleClickSetConciliation = (el) => {

        setInstallmentContents((current) => {
            return current.map((item) => {
                return item.installment === installment.installment
                    ? { ...item, recno: el.R_E_C_N_O_, conciliated: true }
                    : item
            });
        });

        setShowOptions(false);
    };

    const handleClickRemoveConciliation = (el) => {

        setInstallmentContents((current) => {
            return current.map((item) => {
                return item.installment === el.installment
                    ? { ...item, recno: 0, conciliated: false }
                    : item
            });
        });

        setShowOptions(false);
    };

    const getOptions = useCallback(async () => {

        setLoadOptions(true);

        const params = {
            startBalance: installment.value - 0.5,
            endBalance: installment.value + 0.5,
            startDueDate: format(subDays(installment.dueDate, 5), "yyyyMMdd"),
            endDueDate: format(addDays(installment.dueDate, 5), "yyyyMMdd"),
            startPaymentTerm: "CC",
            endPaymentTerm: "CD",
            emptyNsu: true
        };

        const response = await axios.get(`http://localhost:3001/accounts-receivable`, { params });

        setLoadOptions(false);

        setOptions(response.data.data);

    }, [installment]);

    useEffect(() => {

        if (installment) {
            getOptions();
        }

    }, [installment, getOptions])

    return (
        <>
            {!showOptions &&
                installmentContents.map((el) => (
                    <div
                        key={el.installment}
                        className={
                            `installment
                            ${el.conciliated && "installment-conciliated"}
                        `}
                        onClick={() => !el.conciliated && handleClickOptions(el)}
                    >
                        {el.conciliated &&
                            <div className="conciliated-icons">

                                <TiInputChecked className="icon-conciliated icon-conciliated-default" />
                                <TiDelete
                                    className="icon-conciliated-default icon-remove-conciliation"
                                    onClick={() => handleClickRemoveConciliation(el)}
                                />
                            </div>
                        }
                        {!el.conciliated &&
                            <div className="icon-not-conciliated conciliated-icons">
                                <TiInputChecked className="icon-conciliated-default" />
                            </div>

                        }

                        <span>
                            {el.installment}
                        </span>
                        <span>
                            {format(el.dueDate, "dd/MM/yyyy")}
                        </span>
                        <span>
                            {formatCurrency(el.value, "BRL")}
                        </span>
                    </div >
                ))
            }
            {
                loadOptions &&
                <div className="spinner-options">
                    <Spinner></Spinner>
                </div>
            }
            {
                showOptions &&
                <div className="available-options">
                    <div
                        className="installment chosen-installment"
                    >
                        <span>
                            {installment.installment}
                        </span>
                        <span>
                            {format(installment.dueDate, "dd/MM/yyyy")}
                        </span>
                        <span>
                            {formatCurrency(installment.value, "BRL")}
                        </span>
                    </div>

                    {options.length > 0 &&
                        options.map((el) => (
                            <div
                                key={el.R_E_C_N_O_}
                                className="installment"
                                onClick={() => handleClickSetConciliation(el)}
                            >
                                <span className="defaul-span">{el.E1_FILIAL}</span>
                                <span className="defaul-span">{format(el.E1_EMISSAO, "dd/MM/yyyy")}</span>
                                <span className="defaul-span">{el.E1_CONDPAG}</span>
                                <span className="defaul-span">{`${el.E1_NUM} - ${el.E1_PARCELA}`}</span>
                                <span className="defaul-span">{format(el.E1_VENCTO, "dd/MM/yyyy")}</span>
                                <span className="defaul-span">{formatCurrency(el.E1_SALDO, "BRL")}</span>
                            </div>
                        ))
                    }

                    {options.length <= 0 &&
                        <h4 className="not-found-options">Nenhum resultado encontrado</h4>
                    }

                </div>

            }


        </>
    );
}

export default Installments;