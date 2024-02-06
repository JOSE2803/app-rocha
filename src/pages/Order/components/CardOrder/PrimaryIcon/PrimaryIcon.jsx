import "./PrimaryIcon.css";
import propTypes from 'prop-types';
import {
    TfiCommentAlt,
    TfiInfoAlt,
    TfiPrinter,
    TfiExchangeVertical,
    TfiCheckBox,
    TfiFiles
} from "react-icons/tfi";

function PrimaryIcon({ order }) {

    const { C5_NOTA, C5_SERIE, C5_ZSTSOSS, C5_ZSEPARA } = order;

    return (
        <div className="card-order-icons-primary">

            {C5_NOTA &&
                <img
                    className="icon-invoice"
                    src="/assets/icons/invoice.svg"
                    alt="Nota Fiscal Eletrônica"
                    title={`${C5_NOTA}/${C5_SERIE}`}
                />
            }
            <TfiInfoAlt className="icon-log icon-default" title="Log"></TfiInfoAlt>
            <TfiCommentAlt className="icon-comment icon-default" title="Comentários"></TfiCommentAlt>

            {(C5_ZSTSOSS === "ADD" || C5_ZSTSOSS === "ALT") &&
                <TfiPrinter className="icon-printer icon-default" title="Imprimir pedido"></TfiPrinter>
            }

            {(C5_ZSEPARA && (C5_ZSTSOSS === "ALT" || C5_ZSTSOSS === "SPN")) &&
                <TfiExchangeVertical className="icon-change icon-default" title="Trocar separador"></TfiExchangeVertical>
            }

            {C5_ZSTSOSS === "SPN" &&
                <TfiCheckBox className="icon-confirm icon-default" title="Confirmar separação"></TfiCheckBox>
            }

            {C5_ZSTSOSS !== "ADD" &&
                <TfiFiles className="icon-copy icon-default" title="Segunda via do pedido"></TfiFiles>
            }


        </div>
    );
}

PrimaryIcon.propTypes = {
    order: propTypes.shape({
        C5_NOTA: propTypes.string,
        C5_SERIE: propTypes.string,
        C5_ZSTSOSS: propTypes.string,
        C5_ZSEPARA: propTypes.string,
    }).isRequired,
};

export default PrimaryIcon;