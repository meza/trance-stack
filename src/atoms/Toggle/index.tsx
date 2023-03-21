import cx from 'classnames';
import '../../styles/app.css';

export interface ToggleProps {
  name?: string;
  id?: string; // defaults to name
  defaultChecked?: boolean;
  tabIndex?: number;
  disabled?: boolean;
  className?: string;
  readOnly?: boolean;
}

/**
 * A toggle component that can be used to switch between two states.
 *
 * Supports restricted motion. Set your browser to reduce motion to see the effect.
 */
export const Toggle = (props: ToggleProps) => {
  const elementId = props.id || props.name;
  const disabled = props.disabled || props.readOnly;
  return (
    <fieldset
      style={{ margin: 0, padding: 0, border: 0 }}
      id={elementId}
      className={cx('toggle-component', props.className)}
    >
      <input
        name={!props.readOnly ? props.name : undefined}
        type='radio'
        defaultChecked={!props.defaultChecked}
        value={'false'}
        disabled={disabled && props.defaultChecked}
        tabIndex={disabled ? -1 : (props.tabIndex || 0)}
      />
      <input
        name={!props.readOnly ? props.name : undefined}
        type='radio'
        defaultChecked={props.defaultChecked}
        value={'true'}
        disabled={disabled && !props.defaultChecked}
        tabIndex={disabled ? -1 : (props.tabIndex || 0)}
      />
      <span className='slider' aria-hidden='true'></span>
    </fieldset>
  );
};
