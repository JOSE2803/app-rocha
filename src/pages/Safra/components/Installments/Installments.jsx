import "./Installments.css";
import { format } from 'date-fns';
import formatCurrency from "../../../../utils/formatCurrency.js";
import propTypes from 'prop-types';

function Installments({ installmentContents, setShowOptions }) {

    const handleClick = () => {
        setShowOptions(false);
    };

    return (
        <>
            {installmentContents.map((el) => (
                <div
                    key={el.installment}
                    className="installment"
                    onClick={handleClick}
                >
                    <span className="status">
                    </span>
                    <span>
                        {el.installment}
                    </span>
                    <span>
                        {format(el.dueDate, "dd/MM/yyyy")}
                    </span>
                    <span>
                        {formatCurrency(el.value, "BRL")}
                    </span>
                </div>
            ))}
        </>
    );
}

Installments.propTypes = {
    installmentContents: propTypes.array,
    setShowOptions: propTypes.node
}

export default Installments;