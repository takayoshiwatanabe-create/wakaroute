/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InputArea } from './input-area';
import { useTranslations, useLocale } from 'next-intl';
import { isRTL } from '@/i18n/utils';
import { vi } from 'vitest'; // Import vi from vitest

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => 'en'),
}));

// Mock i18n/utils
vi.mock('@/i18n/utils', () => ({
  isRTL: vi.fn(() => false),
}));

describe('InputArea', () => {
  const mockOnDecompose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslations as vi.Mock).mockReturnValue((key: string) => key);
    (useLocale as vi.Mock).mockReturnValue('en');
    (isRTL as vi.Mock).mockReturnValue(false);
  });

  it('renders textarea and buttons', () => {
    render(<InputArea onDecompose={mockOnDecompose} isLoading={false} />);

    expect(screen.getByPlaceholderText('input_placeholder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'decompose_text_button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'decompose_image_button' })).toBeInTheDocument();
  });

  it('calls onDecompose with text input', async () => {
    render(<InputArea onDecompose={mockOnDecompose} isLoading={false} />);

    fireEvent.change(screen.getByPlaceholderText('input_placeholder'), {
      target: { value: 'This is a test text.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'decompose_text_button' }));

    await waitFor(() => {
      expect(mockOnDecompose).toHaveBeenCalledWith('This is a test text.', undefined);
    });
  });

  it('calls onDecompose with image file', async () => {
    render(<InputArea onDecompose={mockOnDecompose} isLoading={false} />);

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const input = screen.getByLabelText('decompose_image_button'); // Assuming the button is linked to file input via label

    // Simulate file selection
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    fireEvent.change(input);

    // Since the button click triggers the form submission, we need to click the actual submit button
    // In this component, the image input itself triggers the action, so we don't need a separate button click for image.
    // The `handleImageChange` function is called directly.
    // We need to ensure the mock is called correctly.
    // The current implementation calls onDecompose directly from handleImageChange.
    await waitFor(() => {
      expect(mockOnDecompose).toHaveBeenCalledWith(undefined, file);
    });
  });

  it('disables inputs and buttons when loading', () => {
    render(<InputArea onDecompose={mockOnDecompose} isLoading={true} />);

    expect(screen.getByPlaceholderText('input_placeholder')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'loading_button' })).toBeDisabled();
    expect(screen.getByLabelText('decompose_image_button')).toBeDisabled();
  });

  it('displays error message for empty text input', async () => {
    render(<InputArea onDecompose={mockOnDecompose} isLoading={false} />);

    fireEvent.click(screen.getByRole('button', { name: 'decompose_text_button' }));

    await waitFor(() => {
      expect(screen.getByText('input_error_message')).toBeInTheDocument();
    });
    expect(mockOnDecompose).not.toHaveBeenCalled();
  });

  it('clears text input after successful decomposition', async () => {
    render(<InputArea onDecompose={mockOnDecompose} isLoading={false} />);

    const textarea = screen.getByPlaceholderText('input_placeholder') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Text to decompose.' } });
    expect(textarea.value).toBe('Text to decompose.');

    fireEvent.click(screen.getByRole('button', { name: 'decompose_text_button' }));

    await waitFor(() => {
      expect(mockOnDecompose).toHaveBeenCalledWith('Text to decompose.', undefined);
      expect(textarea.value).toBe(''); // Should be cleared after submission
    });
  });

  it('applies RTL styles when locale is RTL', () => {
    (isRTL as vi.Mock).mockReturnValue(true);
    render(<InputArea onDecompose={mockOnDecompose} isLoading={false} />);

    const container = screen.getByTestId('input-area-container');
    expect(container).toHaveStyle('direction: rtl');
  });
});

