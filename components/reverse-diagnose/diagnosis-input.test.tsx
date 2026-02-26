/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DiagnosisInput } from './diagnosis-input';
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

describe('DiagnosisInput', () => {
  const mockOnDiagnose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslations as vi.Mock).mockReturnValue((key: string) => key);
    (useLocale as vi.Mock).mockReturnValue('en');
    (isRTL as vi.Mock).mockReturnValue(false);
  });

  it('renders textarea and diagnose button', () => {
    render(<DiagnosisInput onDiagnose={mockOnDiagnose} isLoading={false} />);

    expect(screen.getByPlaceholderText('reverse_diagnose_input_placeholder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'reverse_diagnose_button' })).toBeInTheDocument();
  });

  it('calls onDiagnose with text input', async () => {
    render(<DiagnosisInput onDiagnose={mockOnDiagnose} isLoading={false} />);

    const textarea = screen.getByPlaceholderText('reverse_diagnose_input_placeholder');
    fireEvent.change(textarea, { target: { value: 'I struggle with fractions.' } });

    fireEvent.click(screen.getByRole('button', { name: 'reverse_diagnose_button' }));

    await waitFor(() => {
      expect(mockOnDiagnose).toHaveBeenCalledWith('I struggle with fractions.');
    });
  });

  it('displays error if text input is empty', async () => {
    render(<DiagnosisInput onDiagnose={mockOnDiagnose} isLoading={false} />);

    fireEvent.click(screen.getByRole('button', { name: 'reverse_diagnose_button' }));

    await waitFor(() => {
      expect(screen.getByText('reverse_diagnose_error_empty_input')).toBeInTheDocument();
      expect(mockOnDiagnose).not.toHaveBeenCalled();
    });
  });

  it('disables input and button when loading', () => {
    render(<DiagnosisInput onDiagnose={mockOnDiagnose} isLoading={true} />);

    expect(screen.getByPlaceholderText('reverse_diagnose_input_placeholder')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'loading_button' })).toBeDisabled();
  });

  it('applies RTL styles when locale is RTL', () => {
    (isRTL as vi.Mock).mockReturnValue(true);
    render(<DiagnosisInput onDiagnose={mockOnDiagnose} isLoading={false} />);

    const formElement = screen.getByRole('form');
    expect(formElement).toHaveStyle('direction: rtl');
  });
});
