import React, { useContext, useEffect } from 'react';
import ColorModeSwitcher, { ColorMode, ColorModeContext } from './index';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

const ColorDecorator = (Story: StoryFn) => {
  const { colorMode } = useContext(ColorModeContext);

  const [cmode, setMode] = React.useState<ColorMode>(colorMode || ColorMode.LIGHT);

  useEffect(() => {
    document.firstElementChild?.classList.remove(ColorMode.LIGHT, ColorMode.DARK);
    document.firstElementChild?.classList.add(cmode);
  }, [cmode]);

  useEffect(() => {
    setMode(colorMode);
  }, [colorMode]);

  return (<div style={{ zoom: 5, display: 'grid', placeContent: 'center' }}>
    <ColorModeContext.Provider value={{ colorMode: cmode, setColorMode: setMode }}>
      <Story/>
    </ColorModeContext.Provider>
  </div>);
};

const meta = {
  title: 'Layout/ColorMode Switcher',
  component: ColorModeSwitcher,
  decorators: [ColorDecorator]
} satisfies Meta<typeof ColorModeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {};
