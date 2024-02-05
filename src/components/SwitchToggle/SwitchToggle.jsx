import "./SwitchToggle.css";
import propTypes from 'prop-types';

function SwitchToggle({ isOn, handleToggle, onColor }) {
    return ( 
        <>
        <input
          checked={isOn}
          onChange={handleToggle}
          className="react-switch-checkbox"
          id={`react-switch-new`}
          type="checkbox"
        />
        <label
          style={{ background: isOn && onColor }}
          className="react-switch-label"
          htmlFor={`react-switch-new`}
        >
          <span className={`react-switch-button`} />
        </label>
      </>
     );
}

SwitchToggle.propTypes = {
    isOn: propTypes.bool,
    handleToggle: propTypes.func,
    onColor: propTypes.string,
};

export default SwitchToggle;