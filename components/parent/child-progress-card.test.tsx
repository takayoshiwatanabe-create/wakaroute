/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChildProgressCard } from './child-progress-card';
import { useTranslations } from 'next-intl';
import { vi } from 'vitest';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn().mockReturnValue((key: string) => key),
}));

describe('ChildProgressCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslations as vi.Mock).mockReturnValue((key: string) => key);
  });

  const defaultProps = {
    childName: 'Test Child',
    aiDecompositionsUsed: 3,
    aiDecompositionsLimit: 5,
    lastActivity: 'activity_today' as const,
    recentDiscoveries: 7,
    className: '',
  };

  it('renders child name and AI decomposition progress', () => {
    render(<ChildProgressCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.childName)).toBeInTheDocument();
    expect(screen.getByText(`ai_decompositions_used: ${defaultProps.aiDecompositionsUsed}/${defaultProps.aiDecompositionsLimit}`)).toBeInTheDocument();
  });

  it('renders "unlimited" for AI decomposition limit when Infinity', () => {
    render(<ChildProgressCard {...defaultProps} aiDecompositionsLimit={Infinity} />);

    expect(screen.getByText(`ai_decompositions_used: ${defaultProps.aiDecompositionsUsed}/unlimited`)).toBeInTheDocument();
  });

  it('renders last activity and recent discoveries', () => {
    render(<ChildProgressCard {...defaultProps} />);

    expect(screen.getByText(`last_activity: ${defaultProps.lastActivity}`)).toBeInTheDocument();
    expect(screen.getByText(`recent_discoveries: ${defaultProps.recentDiscoveries}`)).toBeInTheDocument();
  });

  it('applies additional className prop', () => {
    const customClass = 'my-custom-card';
    render(<ChildProgressCard {...defaultProps} className={customClass} />);

    const cardElement = screen.getByTestId('child-progress-card'); // Add data-testid to the main div in ChildProgressCard
    expect(cardElement).toHaveClass(customClass);
  });
});

