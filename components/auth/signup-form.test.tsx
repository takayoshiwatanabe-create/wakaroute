/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from './signup-form';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/app/actions/auth';
import { isRTL } from '@/i18n/utils';
import { vi } from 'vitest'; // Import vi from vitest

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => 'en'),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock the server action
vi.mock('@/app/actions/auth', () => ({
  signupAction: vi.fn(),
}));

// Mock i18n/utils
vi.mock('@/i18n/utils', () => ({
  isRTL: vi.fn(() => false),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslations as vi.Mock).mockReturnValue((key: string) => key);
    (useLocale as vi.Mock).mockReturnValue('en');
    (isRTL as vi.Mock).mockReturnValue(false);
  });

  it('renders email, password, confirm password fields, and signup button', () => {
    render(<SignupForm />);

    expect(screen.getByPlaceholderText('email_placeholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password_placeholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('confirm_password_placeholder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'signup_button' })).toBeInTheDocument();
    expect(screen.getByLabelText('signup_is_parent')).toBeInTheDocument();
  });

  it('displays validation errors for invalid email', async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText('email_placeholder'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'signup_button' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address.')).toBeInTheDocument();
    });
  });

  it('displays validation errors for short password', async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'signup_button' }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
    });
  });

  it('displays validation errors when passwords do not match', async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('confirm_password_placeholder'), {
      target: { value: 'different' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'signup_button' }));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match.")).toBeInTheDocument();
    });
  });

  it('calls signupAction with correct credentials on valid submission (child)', async () => {
    const mockPush = vi.fn();
    (useRouter as vi.Mock).mockReturnValue({ push: mockPush });
    (signupAction as vi.Mock).mockResolvedValue({ success: 'User registered successfully!' });

    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText('email_placeholder'), {
      target: { value: 'child@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('confirm_password_placeholder'), {
      target: { value: 'password123' },
    });

    // Check the "I am a parent" checkbox
    fireEvent.click(screen.getByLabelText('signup_is_parent'));

    // Fill in child email for parent
    fireEvent.change(screen.getByPlaceholderText('signup_child_email_placeholder'), {
      target: { value: 'parent@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'signup_button' }));

    await waitFor(() => {
      expect(signupAction).toHaveBeenCalledWith({
        email: 'child@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        isParent: true,
        childEmail: 'parent@example.com',
      });
      expect(mockPush).toHaveBeenCalledWith('/en/login');
    });
  });

  it('displays an error message on signupAction failure', async () => {
    (signupAction as vi.Mock).mockResolvedValue({ error: 'Email already in use.' });

    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText('email_placeholder'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('confirm_password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'signup_button' }));

    await waitFor(() => {
      expect(screen.getByText('Email already in use.')).toBeInTheDocument();
    });
  });

  it('disables inputs and button during loading state', async () => {
    (signupAction as vi.Mock).mockImplementation(() => new Promise(() => {})); // Never resolve

    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText('email_placeholder'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('confirm_password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'signup_button' }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('email_placeholder')).toBeDisabled();
      expect(screen.getByPlaceholderText('password_placeholder')).toBeDisabled();
      expect(screen.getByPlaceholderText('confirm_password_placeholder')).toBeDisabled();
      expect(screen.getByRole('button', { name: 'loading_button' })).toBeDisabled();
    });
  });

  it('shows child email input when "I am a parent" is checked', async () => {
    render(<SignupForm />);

    expect(screen.queryByPlaceholderText('signup_child_email_placeholder')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('signup_is_parent'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('signup_child_email_placeholder')).toBeInTheDocument();
    });
  });

  it('hides child email input when "I am a parent" is unchecked', async () => {
    render(<SignupForm />);

    fireEvent.click(screen.getByLabelText('signup_is_parent'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('signup_child_email_placeholder')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('signup_is_parent'));
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('signup_child_email_placeholder')).not.toBeInTheDocument();
    });
  });

  it('displays validation error for missing child email when isParent is true', async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText('email_placeholder'), {
      target: { value: 'parent@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('confirm_password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByLabelText('signup_is_parent')); // Check parent checkbox

    fireEvent.click(screen.getByRole('button', { name: 'signup_button' }));

    await waitFor(() => {
      expect(screen.getByText('Child email is required for parent registration and must be a valid email.')).toBeInTheDocument();
    });
  });

  it('renders link for login', () => {
    render(<SignupForm />);

    expect(screen.getByRole('link', { name: /login_link/i })).toHaveAttribute('href', '/en/login');
  });

  it('applies RTL styles when locale is RTL', () => {
    (isRTL as vi.Mock).mockReturnValue(true);
    render(<SignupForm />);

    const formElement = screen.getByRole('form');
    expect(formElement).toHaveStyle('direction: rtl');
  });
});
