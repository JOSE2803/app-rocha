import "./Modal.css";
import propTypes from 'prop-types';

function Modal({ children, activated, onClose }) {
    return (
        <>
            <div className={`background ${!activated && "hide"}`} onClick={onClose}>
                
            </div>
            <div className={`modal ${!activated && "hide"}`}>
                {children}
            </div>
        </>
    );
}

Modal.propTypes = {
    children: propTypes.node,
    activated: propTypes.bool,
    onClose: propTypes.func
};

export default Modal;