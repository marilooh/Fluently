import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Fluently — Medical Spanish for Healthcare Professionals',
  description:
    'Gamified medical Spanish learning app for healthcare professionals. Learn medical Spanish with Duolingo-style lessons, flashcards, and a medical dictionary.',
  keywords: 'medical spanish, healthcare, language learning, duolingo, nursing, medicine',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
