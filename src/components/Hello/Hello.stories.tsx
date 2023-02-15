import { Hello } from './Hello';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Components/Hello',
  component: Hello
} as ComponentMeta<typeof Hello>;

const Template: ComponentStory<typeof Hello> = (args) => <Hello/>;

export const Standard = Template.bind({});
