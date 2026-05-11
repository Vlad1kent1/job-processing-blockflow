import type { Metadata } from 'next';
import { Geologica, Nunito } from 'next/font/google';
import './globals.css';

const geologica = Geologica({
  variable: '--font-geologica',
  subsets: ['latin'],
  display: 'swap',
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Onboarding Flow',
  description: 'High-fidelity onboarding interface built with Next.js, Tailwind, Framer Motion, and Zustand.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geologica.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F8F8FB] text-[#141415] font-body">{children}</body>
    </html>
  );
}
