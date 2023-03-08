import ColorModeSwitcher from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Layout/ColorMode Switcher',
  component: ColorModeSwitcher
} satisfies Meta<typeof ColorModeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ColorModeSwitcher />
};
