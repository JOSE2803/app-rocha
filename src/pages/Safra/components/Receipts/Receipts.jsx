import propTypes from 'prop-types';
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import { groupReceiptsByBranch } from './utils';
import { toast } from 'react-toastify';

import "./Receipts.css";

function Receipts({ receipts }) {

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

    //Retorna a data selecionada já formatada em data.
    const selectReceiptDate = () => {

        let selectedDate = document.querySelector(".receipt-date").value;

        if (selectedDate) {
            selectedDate = new Date(`${selectedDate}T00:00:00`)
        }

        return selectedDate;

    };

    const getData = async () => {

        const selectedReceiptDate = selectReceiptDate();

        if (!selectedReceiptDate) {
            toastError("Nenhuma data selecionada!");
            return;
        }

        await groupReceiptsByBranch(receipts, selectReceiptDate);

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

            {/* <div>
                {receipts.map((item) => (
                    <h1 key={`${item.NSU}${item.PL}`}>{item.PL}</h1>
                ))}
            </div> */}
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