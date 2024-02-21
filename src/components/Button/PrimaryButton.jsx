import "./PrimaryButton.css";
import propTypes from 'prop-types';

function PrimaryButton({ text, onClick }) {
    return ( 
        <>
            <button className="default-button" onClick={onClick}>{text}</button>
        </>
     );
}

PrimaryButton.propTypes = {
    text: propTypes.string,
    onClick: propTypes.func,
};

export default PrimaryButton;