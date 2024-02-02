import "./CardOrder.css";
import propTypes from 'prop-types';
import { format } from 'date-fns';
import formatCurrency from "../../../../utils/formatCurrency.js";

function CardOrder({ order }) {

    const {
        C5_FILIAL,
        C5_NUM,
        C5_ZVERSAO,
        C5_EMISSAO,
        C5_ZHORA,
        A3_NOME,
        C5_CLIENTE,
        C5_LOJACLI,
        A1_NOME,
        A4_NOME,
        E4_DESCRI,
        C5_DESPESA,
        C5_FRETE,
        C6_VALOR,
        C5_ZOBSERV,
        C5_ZSEPARA,
        USR_NOME,
        C5_ZSTSOSS,


    } = order;

    return (

        <div
            className={`
                card-order
                card-order-status
                ${(C5_ZSTSOSS === "ADD") && "card-order-status-add"}
                ${(C5_ZSTSOSS === "ALT") && "card-order-status-alt"}
                ${(C5_ZSTSOSS === "SPN") && "card-order-status-spn"}
                ${(C5_ZSTSOSS === "SPD") && "card-order-status-spd"}
            `}
        >
            <p className="card-order-title">
                {C5_FILIAL}  |  {C5_NUM}  / {C5_ZVERSAO} |  {format(new Date(C5_EMISSAO), "dd/MM/yyyy")} {C5_ZHORA}  |  Vendedor(a): {A3_NOME}
            </p>
            <p className="card-order-client">
                {C5_CLIENTE}/{C5_LOJACLI} - {A1_NOME}
            </p>
            <p className="card-order-shipping card-order-secondarys">
                <strong>ENVIO: </strong>
                {A4_NOME}
            </p>
            <p className="card-order-payment card-order-secondarys">
                <strong>PAGAMENTO: </strong>
                {E4_DESCRI}
            </p>
            <p className="card-order-totals card-order-secondarys">
                <strong>TOTAL DO PEDIDO: </strong>
                {formatCurrency(C5_DESPESA + C5_FRETE + C6_VALOR, "BRL")} -
                <strong> FRETE PAGO: </strong>
                {formatCurrency(C5_FRETE, "BRL")} -
                <strong> OUTRAS DESPESAS: </strong>
                {formatCurrency(C5_DESPESA, "BRL")}
            </p>
            {
                C5_ZOBSERV && (
                    <p className="card-order-observation card-order-secondarys">
                        <strong>OBSERVAÇÃO: </strong>
                        {C5_ZOBSERV}
                    </p>
                )
            }
            {
                (C5_ZSEPARA) && (
                    <p className="card-order-separator card-order-secondarys">
                        <strong>SEPARADOR: </strong>
                        {C5_ZSEPARA} - {USR_NOME}
                    </p>
                )
            }
        </div>

        
    );
}

CardOrder.propTypes = {
    order: propTypes.shape({
        C5_FILIAL: propTypes.string,
        C5_NUM: propTypes.string,
        C5_ZVERSAO: propTypes.number,
        C5_EMISSAO: propTypes.string,
        C5_ZHORA: propTypes.string,
        A3_NOME: propTypes.string,
        C5_CLIENTE: propTypes.string,
        C5_LOJACLI: propTypes.string,
        A1_NOME: propTypes.string,
        A4_NOME: propTypes.string,
        E4_DESCRI: propTypes.string,
        C5_DESPESA: propTypes.number,
        C5_FRETE: propTypes.number,
        C6_VALOR: propTypes.number,
        C5_ZOBSERV: propTypes.string,
        C5_ZSEPARA: propTypes.string,
        USR_NOME: propTypes.string,
        C5_ZSTSOSS: propTypes.string,
    }).isRequired,
    id: propTypes.string,
};

export default CardOrder;