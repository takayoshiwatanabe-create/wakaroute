/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlanCard } from './plan-card';
import { useTranslations } from 'next-intl';
import { vi } from 'vitest';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

describe('PlanCard', () => {
  beforeEach(() => {
    (useTranslations as vi.Mock).mockReturnValue((key: string) => key);
  });

  const defaultProps = {
    planName: 'Basic Plan',
    price: '$10/month',
    features: ['Feature 1', 'Feature 2'],
    isCurrentPlan: false,
    onSelectPlan: vi.fn(),
    buttonText: 'Select Plan',
    disabled: false,
  };

  it('renders plan name, price, and features', () => {
    render(<PlanCard {...defaultProps} />);

    expect(screen.getByText('Basic Plan')).toBeInTheDocument();
    expect(screen.getByText('$10/month')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });

  it('calls onSelectPlan when the button is clicked', () => {
    render(<PlanCard {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Select Plan' }));
    expect(defaultProps.onSelectPlan).toHaveBeenCalledTimes(1);
  });

  it('displays "Current Plan" text and disables the button if it is the current plan', () => {
    render(<PlanCard {...defaultProps} isCurrentPlan={true} />);

    expect(screen.getByText('pricing_current_plan')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'pricing_current_plan' });
    expect(button).toBeDisabled();
    expect(defaultProps.onSelectPlan).not.toHaveBeenCalled(); // Ensure it's not called when disabled
  });

  it('disables the button when disabled prop is true', () => {
    render(<PlanCard {...defaultProps} disabled={true} />);

    const button = screen.getByRole('button', { name: 'Select Plan' });
    expect(button).toBeDisabled();
    fireEvent.click(button); // Attempt to click
    expect(defaultProps.onSelectPlan).not.toHaveBeenCalled(); // Ensure it's not called when disabled
  });

  it('renders "Recommended" badge if isRecommended is true', () => {
    render(<PlanCard {...defaultProps} isRecommended={true} />);

    expect(screen.getByText('pricing_recommended')).toBeInTheDocument();
  });

  it('applies additional className prop', () => {
    const customClass = 'my-custom-card';
    render(<PlanCard {...defaultProps} className={customClass} />);

    expect(screen.getByTestId('plan-card')).toHaveClass(customClass);
  });
});

