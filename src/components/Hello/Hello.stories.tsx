import { Hello } from './index';
import type { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'Components/Hello',
  component: Hello,
  parameters: {
    layout: 'centered'
  }
} as Meta<typeof Hello>;

const Template: StoryFn<typeof Hello> = (args) => <Hello/>;

export const basic = Template.bind({});
