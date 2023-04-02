import { Hello } from './index';
import type { Meta } from '@storybook/react';

export default {
  component: Hello,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof Hello>;

export const Basic = {};
