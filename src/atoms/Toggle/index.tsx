import React, { useEffect } from 'react';
import '../../styles/app.css';

export interface ToggleProps {
  name: string;
  id?: string; // defaults to name
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  tabIndex?: number;
  disabled? :boolean;
  className? :string;
}

/**
 * A toggle component that can be used to switch between two states.
 *
 * Supports restricted motion. Set your browser to reduce motion to see the effect.
 */
export const Toggle = (props: ToggleProps) => {
  const [checked, setChecked] = React.useState(props.checked || false);

  useEffect(() => {
    if (props.onChange) {
      props.onChange(checked);
    }
  }, [checked]);

  useEffect(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked);
    }
  }, [props.checked]);

  const onClick = () => {
    if (props.disabled === true) {
      return;
    }
    setChecked(!checked);
  };

  const elementId = props.id || props.name;
  return (
    <label className={`toggle-component ${props.className}`}>
      <input type={'hidden'} aria-hidden='true' name={props.name} value={checked ? 'true' : 'false'}/>
      <input
        tabIndex={props.tabIndex || 0}
        id={elementId} type='checkbox'
        checked={checked}
        role={'switch'}
        disabled={props.disabled}
        onChange={onClick}
      />
      <span className='slider' aria-hidden='true'></span>
    </label>
  );
};
