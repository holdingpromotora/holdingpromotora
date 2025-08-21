'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { initializeApp } from '@/lib/init';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsClient(true);
    console.log('🔄 Layout: Iniciando...');
    setCurrentTime(new Date().toLocaleString('pt-BR'));

    // Inicializar sistema quando o layout for montado
    const initSystem = async () => {
      try {
        console.log('🔄 Layout: Inicializando sistema...');
        await initializeApp();
        console.log('✅ Layout: Sistema inicializado');
      } catch (error) {
        console.error('❌ Layout: Erro ao inicializar sistema:', error);
      }
    };

    initSystem();
    console.log('✅ Layout: Inicialização concluída');
  }, []);

  // Adicionar useEffect para monitorar mudanças no usuário
  useEffect(() => {
    console.log('👤 Layout: Usuário alterado:', user);
    if (user) {
      console.log(
        '✅ Layout: Usuário ativo:',
        user.email,
        'Perfil:',
        user.perfil_nome
      );
      console.log('✅ Layout: Usuário aprovado:', user.aprovado);
      console.log('✅ Layout: Usuário ativo:', user.ativo);
    } else {
      console.log('❌ Layout: Nenhum usuário ativo');
    }
  }, [user]);

  // REMOVIDO: useEffect que estava verificando localStorage constantemente
  // Isso estava causando problemas e logout automático

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    console.log('🚪 Layout: Logout solicitado');
    console.log('🚪 Layout: Usuário atual:', user);
    
    // IMPORTANTE: Só fazer logout se for explicitamente solicitado
    // Não fazer logout automático em caso de erro
    if (!user || user.id === undefined) {
      console.log('🔄 Logout cancelado - usuário já não está ativo');
      return;
    }
    
    // Confirmar logout apenas se for usuário válido
    if (confirm('Tem certeza que deseja fazer logout?')) {
      console.log('✅ Layout: Logout confirmado pelo usuário');
      logout();
    } else {
      console.log('❌ Layout: Logout cancelado pelo usuário');
    }
  };

  return (
    <div className="flex h-screen bg-holding-primary">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-holding-secondary border-b border-holding-accent/30 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-holding-white">
              Sistema de Crédito Consignado
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-holding-accent-light">
                Último acesso: {isClient ? currentTime : 'Carregando...'}
              </div>
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-holding-white">
                      {user.nome}
                    </div>
                    <div className="text-xs text-holding-accent-light capitalize">
                      {user.perfil_nome || 'Sem perfil'}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-holding-accent-light hover:text-holding-white hover:bg-holding-accent/20"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-auto bg-holding-primary">
          {children}
        </main>
      </div>
    </div>
  );
}
