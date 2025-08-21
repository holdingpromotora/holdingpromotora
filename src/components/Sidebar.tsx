'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Key,
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
  UserPlus,
  Calculator,
  BarChart3,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  CheckCircle,
  User,
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [usuariosSubmenuOpen, setUsuariosSubmenuOpen] = React.useState(
    pathname.startsWith('/usuarios')
  );
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Abrir submenu automaticamente quando estiver em uma rota de usuários
  React.useEffect(() => {
    if (pathname.startsWith('/usuarios')) {
      setUsuariosSubmenuOpen(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleUsuariosSubmenu = () => {
    setUsuariosSubmenuOpen(!usuariosSubmenuOpen);
  };

  if (!isClient) {
    return (
      <div className="bg-holding-dark border-r border-holding-accent/30 w-64">
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-holding-highlight border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-holding-dark border-r border-holding-accent/30 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-holding-accent/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-holding-white">Holding</h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <Link
          href="/dashboard"
          className={`nav-item ${
            pathname === '/dashboard'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Dashboard</span>}
        </Link>

        <Link
          href="/clientes"
          className={`nav-item ${
            pathname === '/clientes'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <Users className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Clientes</span>}
        </Link>

        <Link
          href="/simulacoes"
          className={`nav-item ${
            pathname === '/simulacoes'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <Calculator className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Simulações</span>}
        </Link>

        <Link
          href="/propostas"
          className={`nav-item ${
            pathname === '/propostas'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Propostas</span>}
        </Link>

        <Link
          href="/relatorios"
          className={`nav-item ${
            pathname === '/relatorios'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <BarChart3 className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Relatórios</span>}
        </Link>

        {/* Usuários com Submenu */}
        <div className="space-y-1">
          <button
            onClick={toggleUsuariosSubmenu}
            className={`nav-item justify-between ${
              pathname.startsWith('/usuarios')
                ? 'bg-holding-highlight text-white shadow-lg'
                : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
            }`}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">Usuários</span>}
            </div>
            {!isCollapsed &&
              (usuariosSubmenuOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              ))}
          </button>

          {/* Submenu Usuários */}
          {usuariosSubmenuOpen && !isCollapsed && (
            <div className="ml-6 space-y-1">
              <Link
                href="/usuarios"
                className={`nav-item py-2 ${
                  pathname === '/usuarios'
                    ? 'bg-holding-highlight/50 text-white'
                    : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
                }`}
              >
                <UserPlus className="w-4 h-4 flex-shrink-0" />
                <span className="ml-3">Cadastrados</span>
              </Link>

              <Link
                href="/usuarios/aprovacao"
                className={`nav-item py-2 ${
                  pathname === '/usuarios/aprovacao'
                    ? 'bg-holding-highlight/50 text-white'
                    : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
                }`}
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="ml-3">Aprovação</span>
              </Link>

              <Link
                href="/usuarios/niveis-acesso"
                className={`nav-item py-2 ${
                  pathname === '/usuarios/niveis-acesso'
                    ? 'bg-holding-highlight/50 text-white'
                    : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
                }`}
              >
                <Key className="w-4 h-4 flex-shrink-0" />
                <span className="ml-3">Níveis de Acesso</span>
              </Link>

              <Link
                href="/usuarios/cadastro-pf"
                className={`nav-item py-2 ${
                  pathname === '/usuarios/cadastro-pf'
                    ? 'bg-holding-highlight/50 text-white'
                    : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
                }`}
              >
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="ml-3">Cadastro PF</span>
              </Link>

              <Link
                href="/usuarios/cadastro-pj"
                className={`nav-item py-2 ${
                  pathname === '/usuarios/cadastro-pj'
                    ? 'bg-holding-highlight/50 text-white'
                    : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
                }`}
              >
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="ml-3">Cadastro PJ</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/configuracoes"
          className={`nav-item ${
            pathname === '/configuracoes'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Configurações</span>}
        </Link>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-holding-accent/30">
        <button
          onClick={handleLogout}
          className="nav-item text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </button>
      </div>
    </div>
  );
}
