import React from 'react';

export interface ToggleProps {
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  tabIndex?: number;
}

/**
 * A toggle component that can be used to switch between two states.
 *
 * Supports restricted motion. Set your browser to reduce motion to see the effect.
 *
 * @param props{ToggleProps}
 * @constructor
 */
export const Toggle = (props: ToggleProps) => {
  const [checked, setChecked] = React.useState(props.checked || false);
  const elementName = props.name || 'toggle';
  return (
    <label className='toggle-component' onClick={() => setChecked(!checked)}>
      <input type={'hidden'} aria-hidden='true' name={props.name} value={checked ? 'true' : 'false'}/>
      <input tabIndex={props.tabIndex || 0} id={elementName} type='checkbox' defaultChecked={checked} role={'switch'} aria-label={'test setting'}/>
      <span className='slider' aria-hidden='true'></span>
    </label>
  );
};
