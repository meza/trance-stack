import { createRemixStub } from '@remix-run/testing/dist/create-remix-stub';
import ColorModeSwitcher from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Layout/ColorMode Switcher',
  component: ColorModeSwitcher
} satisfies Meta<typeof ColorModeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

const createRemixStoryDecorator = (Story: any) => {
  const RemixStub = createRemixStub([
    {
      path: '/*',
      element: <Story/>,
      action: () => ({ redirect: '/' }),
      loader: () => ({ redirect: '/' })
    }
  ]);
  return <RemixStub/>;
};

export const Default: Story = {
  render: () => <ColorModeSwitcher/>,
  decorators: [
    createRemixStoryDecorator
  ]
};
