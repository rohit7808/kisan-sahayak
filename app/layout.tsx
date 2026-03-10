import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GovtHeader from '@/components/GovtHeader';
import Chatbot from '@/components/Chatbot';
import { LanguageProvider } from '@/context/LanguageContext';
import AuthGuard from '@/components/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kisan Sahayak - Agriculture Website',
  description: 'Empowering farmers with modern technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthGuard>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <GovtHeader />
              <Navbar />
              <main style={{ flex: 1 }}>{children}</main>
              <Chatbot />
              <Footer />
            </div>
          </AuthGuard>
        </LanguageProvider>
      </body>
    </html>
  );
}
