import "./SwitchToggle.css";
import propTypes from 'prop-types';

function SwitchToggle({
  isOn,
  handleToggle,
  onColor,
  widthBar,
  heightBar,
  widthCircle,
  heightCircle,
 }) {
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
        style={{ background: isOn && onColor, width: `${widthBar}px`, height: `${heightBar}px` }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span
          className={`react-switch-button`}
          style={{ width: `${widthCircle}px`,  height: `${heightCircle}px`}}
        />
      </label>
    </>
  );
}

SwitchToggle.propTypes = {
  isOn: propTypes.bool,
  handleToggle: propTypes.func,
  onColor: propTypes.string,
  widthBar: propTypes.string,
  heightBar: propTypes.string,
  widthCircle: propTypes.string,
  heightCircle: propTypes.string,
};

export default SwitchToggle;