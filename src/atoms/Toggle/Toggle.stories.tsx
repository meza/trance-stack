import { Toggle } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: Toggle,
  argTypes: {
    defaultChecked: {
      control: {
        type: 'boolean'
      }
    },
    id: {
      description: 'Defaults to the name if not given',
      control: {
        type: 'text'
      }
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
    defaultChecked: true
  }
};

export const Unchecked: Story = {
  args: {
    name: 'unchecked-input',
    defaultChecked: false
  }
};
