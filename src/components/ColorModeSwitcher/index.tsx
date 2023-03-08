import React, { useContext, useEffect } from 'react';
import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { StaticContent } from '~/components/StaticContent';

export enum ColorMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface ColorModeContextProps {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
}

export const ColorModeContext = React.createContext<ColorModeContextProps>({} as ColorModeContextProps);

export interface ColorModeSensorProps {
  nonce: string | undefined;
}

export const ColorModeSensor = (props: ColorModeSensorProps) => {
  const inputProps: { nonce?: string } = {};
  if (props.nonce) {
    inputProps.nonce = props.nonce;
  }

  // detect the user's preferences and update the root element if it is not set already
  return (
    <StaticContent
      element={'script'}
      {...inputProps}
      id={'color-mode-sensor'}
      dangerouslySetInnerHTML={{
        __html: `const cl=document.firstElementChild.classList;
if(!(cl.contains('dark')||cl.contains('light'))){cl.add(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}`
      }}
    />
  );
};

export default function ColorModeSwitcher() {
  const { colorMode, setColorMode } = useContext(ColorModeContext);
  // defaulting to the ColorMode.LIGHT makes react not moan about uncontrolled components as the hidden input needs a mode
  // the colorMode would be null if it's not set by the server
  const [nextColorMode, setNextColorMode] = React.useState<ColorMode>(colorMode || ColorMode.LIGHT);
  const { t } = useTranslation();

  useEffect(() => {
    setNextColorMode(colorMode === ColorMode.LIGHT ? ColorMode.DARK : ColorMode.LIGHT);
  }, [colorMode]);

  useEffect(() => {
    // if there's no colour preference set, update the button in relation to the html tag
    if (!colorMode) {
      const container = document.firstElementChild;
      const cl = container?.classList;
      if (cl?.contains(ColorMode.DARK)) {
        setNextColorMode(ColorMode.LIGHT);
      } else {
        setNextColorMode(ColorMode.DARK);
      }
    }
  });

  const toggleColorMode = () => {
    setColorMode(nextColorMode);
  };

  return (
    // Awesome switcher design by @AdamArgyleInk: https://youtu.be/kZiS1QStIWc
    <Form method="post" action="/settings/color-mode" replace>
      <input type={'hidden'} name={'colorMode'} value={nextColorMode}/>
      <button
        type={'submit'}
        className="color-mode-toggle"
        id="colorMode-toggle"
        title={t('translation:app.colorModeToggle', { nextMode: nextColorMode }).toString()}
        aria-live="polite"
        onClick={toggleColorMode}>
        <svg className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
          <mask className="moon" id="moon-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white"/>
            <circle cx="24" cy="10" r="6" fill="black"/>
          </mask>
          <circle className="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor"/>
          <g className="sun-beams" stroke="currentColor">
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </g>
        </svg>
      </button>
    </Form>
  );
}
