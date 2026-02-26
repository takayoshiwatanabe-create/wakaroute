/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { AiFeedback } from './ai-feedback';
import { useTranslations } from 'next-intl';
import { vi } from 'vitest'; // Import vi from vitest

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

describe('AiFeedback', () => {
  beforeEach(() => {
    (useTranslations as vi.Mock).mockReturnValue((key: string) => key);
  });

  it('renders with success type and correct styling', () => {
    const message = 'Success message!';
    render(<AiFeedback message={message} type="success" />);

    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toBeInTheDocument();
    expect(feedbackElement).toHaveTextContent(message);
    expect(feedbackElement).toHaveClass('bg-green-100 dark:bg-green-900');
    expect(feedbackElement).toHaveClass('text-green-800 dark:text-green-200');
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('renders with info type and correct styling', () => {
    const message = 'Info message!';
    render(<AiFeedback message={message} type="info" />);

    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toBeInTheDocument();
    expect(feedbackElement).toHaveTextContent(message);
    expect(feedbackElement).toHaveClass('bg-blue-100 dark:bg-blue-900');
    expect(feedbackElement).toHaveClass('text-blue-800 dark:text-blue-200');
    expect(screen.getByText('💡')).toBeInTheDocument();
  });

  it('applies additional className prop', () => {
    const message = 'Custom class test';
    const customClass = 'my-custom-class';
    render(<AiFeedback message={message} type="success" className={customClass} />);

    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toHaveClass(customClass);
  });
});
