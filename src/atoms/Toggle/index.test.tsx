import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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
    render(<Toggle
      name='testToggle'
      onChange={mockOnChange}
      checked={false}
    />);
    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
    expect(toggle).toBeChecked();
  });

  it('should not call the onChange function when toggle is disabled.', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<Toggle
      name='testToggle'
      onChange={mockOnChange}
      checked={false}
      disabled={true}
    />);
    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(toggle).not.toBeChecked();
  });

  it('switches between checked and unchecked state.', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<Toggle name='testToggle' />);
    const toggle = getByRole('switch');
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(toggle).toBeChecked();
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
  });
});
