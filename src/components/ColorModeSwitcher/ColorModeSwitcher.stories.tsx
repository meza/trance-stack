import { createRemixStub } from '@remix-run/testing/dist/create-remix-stub';
import ColorModeSwitcher, { ColorMode } from './index';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

const Template: StoryFn<{ mode: ColorMode }> = ({ mode }) => {
  document.firstElementChild?.classList.remove(ColorMode.LIGHT, ColorMode.DARK);
  document.firstElementChild?.classList.add(mode);
  return <ColorModeSwitcher/>;
};

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

const meta = {
  title: 'Layout/ColorMode Switcher',
  component: Template,
  decorators: [createRemixStoryDecorator],
  argTypes: {
    mode: {
      control: 'select',
      options: Object.values(ColorMode)
    }
  },
  args: {
    mode: ColorMode.LIGHT
  }
} satisfies Meta<typeof ColorModeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light = {
  args: {
    mode: ColorMode.LIGHT
  }
};
