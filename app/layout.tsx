import { ReactNode } from 'react';

export const metadata = {
  title: 'ワカルート',
  description: 'AI-powered learning route planner',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
