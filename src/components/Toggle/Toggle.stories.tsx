import { Toggle } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Atoms/Toggle',
  component: Toggle,
  argTypes: {
    checked: {
      control: {
        type: 'boolean'
      }
    },
    onChange: {
      action: 'disabled'
    },
    name: {
      control: {
        type: 'text'
      }
    }
  },
  args: {
    name: 'test-input',
    tabIndex: 0
  }
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    name: 'checked-input',
    checked: true
  }
};

export const Unchecked: Story = {
  parameters: {
    styles: 'motion-reduce'
  },
  args: {
    name: 'unchecked-input',
    checked: false
  }
};
