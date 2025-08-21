import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Holding Promotora - Sistema de Cadastro',
  description: 'Sistema moderno de cadastro e gerenciamento de clientes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="holding-layout">
      <body
        className={`${inter.className} antialiased text-holding-white overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <div className="min-h-screen">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
