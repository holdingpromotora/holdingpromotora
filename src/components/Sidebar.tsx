'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  Key,
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
  Database,
  UserPlus,
  Building2,
  Calculator,
  BarChart3,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  CheckCircle,
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
  const { logout, user } = useAuth();
  const [usuariosSubmenuOpen, setUsuariosSubmenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleUsuariosSubmenu = () => {
    setUsuariosSubmenuOpen(!usuariosSubmenuOpen);
  };

  return (
    <div
      className={`bg-holding-dark border-r border-holding-accent/30 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-holding-accent/30">
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

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            pathname === '/dashboard'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        <Link
          href="/clientes"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            pathname === '/clientes'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <Users className="w-5 h-5" />
          {!isCollapsed && <span>Clientes</span>}
        </Link>

        <Link
          href="/simulacoes"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            pathname === '/simulacoes'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <Calculator className="w-5 h-5" />
          {!isCollapsed && <span>Simulações</span>}
        </Link>

        <Link
          href="/propostas"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            pathname === '/propostas'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <FileText className="w-5 h-5" />
          {!isCollapsed && <span>Propostas</span>}
        </Link>

        <Link
          href="/relatorios"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            pathname === '/relatorios'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          {!isCollapsed && <span>Relatórios</span>}
        </Link>

        {/* Usuários com Submenu */}
        <div className="space-y-1">
          <button
            onClick={toggleUsuariosSubmenu}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ${
              pathname.startsWith('/usuarios')
                ? 'bg-holding-highlight text-white shadow-lg'
                : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5" />
              {!isCollapsed && <span>Usuários</span>}
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
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  pathname === '/usuarios'
                    ? 'bg-holding-highlight/50 text-white'
                    : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrados</span>
              </Link>

              <Link
                href="/usuarios/aprovacao"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  pathname === '/usuarios/aprovacao'
                    ? 'bg-holding-highlight/50 text-white'
                    : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Aprovação</span>
              </Link>

              <Link
                href="/usuarios/niveis-acesso"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  pathname === '/usuarios/niveis-acesso'
                    ? 'bg-holding-highlight/50 text-white'
                    : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Níveis de Acesso</span>
              </Link>

              <Link
                href="/usuarios/perfis"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  pathname === '/usuarios/perfis'
                    ? 'bg-holding-highlight/50 text-white'
                    : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Perfis</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/configuracoes"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            pathname === '/configuracoes'
              ? 'bg-holding-highlight text-white shadow-lg'
              : 'text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Configurações</span>}
        </Link>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-holding-accent/30">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-holding-accent-light hover:bg-holding-accent/20 hover:text-holding-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}
