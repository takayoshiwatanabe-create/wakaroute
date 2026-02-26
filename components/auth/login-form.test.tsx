/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
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

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

// Mock i18n/utils
vi.mock('@/i18n/utils', () => ({
  isRTL: vi.fn(() => false),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslations as vi.Mock).mockReturnValue((key: string) => key);
    (useLocale as vi.Mock).mockReturnValue('en');
    (isRTL as vi.Mock).mockReturnValue(false);
  });

  it('renders email and password fields and a login button', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('email_placeholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password_placeholder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'login_button' })).toBeInTheDocument();
  });

  it('displays validation errors for invalid email', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('email_placeholder'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'login_button' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address.')).toBeInTheDocument();
    });
  });

  it('displays validation errors for short password', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'login_button' }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
    });
  });

  it('calls signIn with correct credentials on valid submission', async () => {
    const mockPush = vi.fn();
    (useRouter as vi.Mock).mockReturnValue({ push: mockPush });
    (signIn as vi.Mock).mockResolvedValue({ error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('email_placeholder'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'login_button' }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/en/decompose');
    });
  });

  it('displays a generic error message on signIn failure', async () => {
    (signIn as vi.Mock).mockResolvedValue({ error: 'CredentialsSignin' });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('email_placeholder'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'login_button' }));

    await waitFor(() => {
      expect(screen.getByText('login_error_message')).toBeInTheDocument();
    });
  });

  it('disables inputs and button during loading state', async () => {
    (signIn as vi.Mock).mockImplementation(() => new Promise(() => {})); // Never resolve

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('email_placeholder'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('password_placeholder'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'login_button' }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('email_placeholder')).toBeDisabled();
      expect(screen.getByPlaceholderText('password_placeholder')).toBeDisabled();
      expect(screen.getByRole('button', { name: 'loading_button' })).toBeDisabled();
    });
  });

  it('renders links for forgot password and signup', () => {
    render(<LoginForm />);

    expect(screen.getByRole('link', { name: 'forgot_password' })).toHaveAttribute('href', '/en/forgot-password');
    expect(screen.getByRole('link', { name: /signup_link/i })).toHaveAttribute('href', '/en/signup');
  });

  it('applies RTL styles when locale is RTL', () => {
    (isRTL as vi.Mock).mockReturnValue(true);
    render(<LoginForm />);

    const formElement = screen.getByRole('form');
    expect(formElement).toHaveStyle('direction: rtl');
  });
});
