'use client';

import TestSidebar from './TestSidebar';
import { useState, useEffect } from 'react';

interface TestLayoutProps {
  children: React.ReactNode;
}

export default function TestLayout({ children }: TestLayoutProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-screen bg-gray-900">
        <div className="flex items-center justify-center w-full">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <TestSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <h1 className="text-xl font-semibold text-white">
            Sistema de Crédito Consignado
          </h1>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto bg-gray-900 p-6">{children}</main>
      </div>
    </div>
  );
}
