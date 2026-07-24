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
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
