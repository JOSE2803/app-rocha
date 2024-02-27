import "./CardSafra.css";
import propTypes from 'prop-types';
import { format } from 'date-fns';
import formatCurrency from "../../../../utils/formatCurrency.js";
import visaIcon from "../../../../../public/assets/icons/visa.svg"
import eloIcon from "../../../../../public/assets/icons/elo.svg"
import mastercard from "../../../../../public/assets/icons/mastercard.svg"

function CardSafra({ sale }) {

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

    return (
        <div
            className={`
                card-safra
                ${(!Conciliated) && "card-safra-conciliated-no"}
                ${(Conciliated) && "card-safra-conciliated-yes"}
            `}
        >
            <div className="card-icon">
                {
                    Product.includes("VISA") && <img className="visa-icon" title="Visa" src={visaIcon} alt="Visa" />
                }
                {
                    Product.includes("MASTERCARD") && <img src={mastercard} title="Mastercard" alt="Mastercard" />
                }
                {
                    Product.includes("ELO") && <img src={eloIcon} title="Elo" alt="Elo" />
                }
            </div>


            <p className="safra-nsu" title="NSU">
                {
                    Nsu.replace("'", "").trim()
                }
            </p>
            <p className="safra-createdat" title="Data da venda">
                {format(new Date(CreatedAt), "dd/MM/yyyy HH:mm:ss")}
            </p>
            <div className="safra-values">
                <p className="safra-gross-value" title="Valor da venda">
                    {formatCurrency(parseFloat(GrossValue), "BRL")}
                </p>
                <p className="safra-details">
                    Taxa: {parseFloat(Tax)}%
                    Valor líquido: {formatCurrency(parseFloat(NetValue), "BRL")}
                </p>
            </div>
            <p className="safra-modality" title="Modalidade">
                {Modality.replace("'", "").trim()}
                {parseInt(Installment) > 1 && ` (${parseInt(Installment)}X)`}
            </p>
            <div className="safra-details">
                <p>
                    Loja: {CommercialPlace.replace("'", "").trim()} Terminal: {Terminal.replace("'", "").trim()}
                </p>
                <p>
                    Cartão: {CardNumber.replace("'", "").trim()} Autorização: {Autorization.replace("'", "").trim()}
                </p>
            </div>

        </div>
    );
}

CardSafra.propTypes = {
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

export default CardSafra;