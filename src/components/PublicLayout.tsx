'use client';

import { useState, useEffect } from 'react';
import { initializeApp } from '@/lib/init';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log('🔄 PublicLayout: Iniciando...');

    // Inicializar sistema quando o layout for montado
    const initSystem = async () => {
      try {
        console.log('🔄 PublicLayout: Inicializando sistema...');
        await initializeApp();
        console.log('✅ PublicLayout: Sistema inicializado');
      } catch (error) {
        console.error('❌ PublicLayout: Erro ao inicializar sistema:', error);
      }
    };

    initSystem();
    console.log('✅ PublicLayout: Inicialização concluída');
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen holding-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-holding-highlight border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-holding-white text-xl">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen holding-gradient">
      <div className="flex">
        {/* Sidebar simplificado para páginas públicas */}
        <div className="w-64 bg-holding-secondary/50 backdrop-blur-sm border-r border-holding-accent/30 min-h-screen p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-holding-white mb-2">
              Holding Promotora
            </h1>
            <p className="text-holding-accent-light text-sm">
              Sistema de Cadastro
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="text-holding-accent-light text-sm">
              <p>• Cadastro de Pessoa Física</p>
              <p>• Cadastro de Pessoa Jurídica</p>
              <p>• Sistema de Aprovação</p>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
