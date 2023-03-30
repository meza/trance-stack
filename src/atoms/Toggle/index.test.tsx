import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Toggle } from './index';

describe('The toggle component', () => {

  it('renders with default props', () => {
    const { getByRole } = render(<Toggle name='testToggle' />);
    const toggle = getByRole('switch');
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
  });

  it('renders with custom props.', () => {
    const comp = render(<Toggle name='testToggle' checked={true} id='customId' className='customClass' />);
    const toggle = comp.getByRole('switch');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toBeChecked();
    expect(toggle).toHaveAttribute('id', 'customId');
    expect(comp.container.firstChild).toHaveClass('customClass');
  });

  it('renders with disabled prop set to true.', () => {
    const { getByRole } = render(<Toggle name='testToggle' disabled={true} />);
    const toggle = getByRole('switch');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toBeDisabled();
  });

  it('renders with tabIndex prop set to -1.', () => {
    const { getByRole } = render(<Toggle name='testToggle' tabIndex={-1} />);
    const toggle = getByRole('switch');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('tabIndex', '-1');
  });

  it('should call the onChange function when toggle state changes.', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const comp = render(<Toggle
      name='testToggle'
      onChange={mockOnChange}
      checked={false}
    />);
    const toggle = comp.container.firstChild;
    expect(toggle).not.toBeChecked();
    await user.click(comp.container?.firstChild as HTMLElement);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should work', () => {
    expect(1).toBe(1);
  });
});
