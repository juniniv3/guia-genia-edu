import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Counter from './Counter';

describe('Counter', () => {
  it('increments on click', async () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: 'Count: 0' });
    await userEvent.click(button);
    expect(button).toHaveTextContent('Count: 1');
  });
});
