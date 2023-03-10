import React from 'react';
import ColorModeSwitcher, { ColorMode } from './index';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

const Template: StoryFn<{ mode: ColorMode, zoom: number }> = ({ mode, zoom }) => {
  document.firstElementChild?.classList.remove(ColorMode.LIGHT, ColorMode.DARK);
  document.firstElementChild?.classList.add(mode);
  return <div style={{ zoom: zoom, display: 'grid', placeContent: 'center' }}><ColorModeSwitcher/></div>;
};

const meta = {
  title: 'Layout/ColorMode Switcher',
  component: React.memo(Template),
  argTypes: {
    mode: {
      defaultValue: ColorMode.LIGHT,
      description: 'Color mode',
      control: 'select',
      options: Object.values(ColorMode)
    },
    zoom: {
      description: 'Zoom in to see the switcher',
      defaultValue: 1,
      control: {
        type: 'range',
        min: 1,
        max: 10
      }
    }
  },
  args: {
    zoom: 5,
    mode: ColorMode.LIGHT
  }
} satisfies Meta<typeof ColorModeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    mode: ColorMode.LIGHT
  }
};
