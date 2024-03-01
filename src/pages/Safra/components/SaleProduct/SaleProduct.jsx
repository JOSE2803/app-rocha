import "./SaleProduct.css";
import propTypes from 'prop-types';
import visaIcon from "/assets/icons/visa.svg"
import eloIcon from "/assets/icons/elo.svg"
import mastercard from "/assets/icons/mastercard.svg"

function SaleProduct({ product }) {
    return (
        <div className="product">
            {
                product.includes("VISA") && <img className="visa-icon" title={product} src={visaIcon} alt="Visa" />
            }
            {
                product.includes("MASTERCARD") && <img src={mastercard} title={product} alt="Mastercard" />
            }
            {
                product.includes("ELO") && <img src={eloIcon} title={product} alt="Elo" />
            }
        </div>
    );
}

SaleProduct.propTypes = {
    product: propTypes.string.isRequired,
};

export default SaleProduct;