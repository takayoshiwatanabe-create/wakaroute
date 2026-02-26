/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { StepDisplay } from './step-display';
import { useTranslations } from 'next-intl';
import { vi } from 'vitest';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

describe('StepDisplay', () => {
  beforeEach(() => {
    (useTranslations as vi.Mock).mockReturnValue((key: string) => key);
  });

  const mockSteps = [
    "Step 1: Understand the basics.",
    "Step 2: Practice simple exercises.",
    "Step 3: Review challenging concepts."
  ];

  it('renders the title', () => {
    render(<StepDisplay steps={mockSteps} />);
    expect(screen.getByText('reverse_diagnose_steps_title')).toBeInTheDocument();
  });

  it('renders all provided steps as list items', () => {
    render(<StepDisplay steps={mockSteps} />);

    mockSteps.forEach((step, index) => {
      expect(screen.getByText(step)).toBeInTheDocument();
      // Check for the step number
      expect(screen.getByText(`${index + 1}.`)).toBeInTheDocument();
    });
  });

  it('applies additional className prop', () => {
    const customClass = 'my-custom-steps';
    render(<StepDisplay steps={mockSteps} className={customClass} />);

    const container = screen.getByTestId('step-display-container');
    expect(container).toHaveClass(customClass);
  });

  it('renders nothing if steps array is empty', () => {
    const { container } = render(<StepDisplay steps={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing if steps array is null', () => {
    const { container } = render(<StepDisplay steps={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});

