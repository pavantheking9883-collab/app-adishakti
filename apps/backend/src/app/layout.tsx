import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ADISHAKTI — Command & Control Web Dashboards',
  description: 'Multilingual Platform for Women Safety, Empowerment & Economic Inclusion by Quantex Intelligence Systems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
