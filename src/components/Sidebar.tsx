'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Building2,
  Home,
  Users,
  Calculator,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ChevronDown,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  hasSubmenu?: boolean;
  submenu?: Array<{
    id: string;
    label: string;
    path: string;
  }>;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'clientes', label: 'Clientes', icon: Users, path: '/clientes' },
    {
      id: 'simulacoes',
      label: 'Simulações',
      icon: Calculator,
      path: '/simulacoes',
    },
    { id: 'propostas', label: 'Propostas', icon: FileText, path: '/propostas' },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: BarChart3,
      path: '/relatorios',
    },
    {
      id: 'usuarios',
      label: 'Usuários',
      icon: UserCheck,
      path: '/usuarios',
      hasSubmenu: true,
      submenu: [
        {
          id: 'usuarios-cadastrados',
          label: 'Cadastrados',
          path: '/usuarios',
        },
        {
          id: 'niveis-acesso',
          label: 'Níveis de Acesso',
          path: '/usuarios/niveis-acesso',
        },
      ],
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      path: '/configuracoes',
    },
  ];

  const handleMenuClick = (
    itemId: string,
    path: string,
    hasSubmenu?: boolean
  ) => {
    if (hasSubmenu) {
      setExpandedMenus(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setActiveItem(itemId);
      router.push(path);
    }
  };

  const handleSubmenuClick = (itemId: string, path: string) => {
    setActiveItem(itemId);
    router.push(path);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div
      className={`h-screen bg-holding-secondary border-r border-holding-accent/30 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header da Sidebar */}
      <div className="p-4 border-b border-holding-accent/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-holding-highlight rounded-lg flex items-center justify-center neon-glow">
                <Building2 className="w-5 h-5 text-holding-white" />
              </div>
              <span className="text-holding-white font-bold text-lg">HP</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-holding-accent hover:text-holding-white hover:bg-holding-accent/20"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Perfil do Usuário */}
      <div className="p-4 border-b border-holding-accent/30">
        <Card className="glass-effect-accent border-holding-accent/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/avatar-placeholder.jpg" />
                <AvatarFallback className="bg-holding-highlight text-holding-white font-bold">
                  AG
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-holding-white font-medium text-sm truncate">
                    Armandogomes
                  </p>
                  <p className="text-holding-accent-light text-xs truncate">
                    grupoarmandogomes@gmail.com
                  </p>
                  <p className="text-holding-highlight text-xs font-medium">
                    Usuário Master
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isExpanded = expandedMenus.includes(item.id);
          const hasSubmenu = 'hasSubmenu' in item && item.hasSubmenu;

          return (
            <div key={item.id} className="space-y-1">
              <Button
                variant={activeItem === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start space-x-3 h-12 ${
                  activeItem === item.id
                    ? 'bg-holding-highlight text-holding-white hover:bg-holding-highlight-light neon-glow'
                    : 'text-holding-accent hover:text-holding-white hover:bg-holding-accent/20'
                }`}
                onClick={() => handleMenuClick(item.id, item.path, hasSubmenu)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {hasSubmenu && (
                      <ChevronDown
                        className={`w-4 h-4 ml-auto transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </>
                )}
              </Button>

              {/* Submenu */}
              {hasSubmenu && isExpanded && !isCollapsed && item.submenu && (
                <div className="ml-6 space-y-1">
                  {item.submenu.map(subItem => (
                    <Button
                      key={subItem.id}
                      variant={activeItem === subItem.id ? 'default' : 'ghost'}
                      className={`w-full justify-start space-x-3 h-10 text-sm ${
                        activeItem === subItem.id
                          ? 'bg-holding-accent/30 text-holding-white hover:bg-holding-accent/40'
                          : 'text-holding-accent-light hover:text-holding-white hover:bg-holding-accent/10'
                      }`}
                      onClick={() =>
                        handleSubmenuClick(subItem.id, subItem.path)
                      }
                    >
                      <span>{subItem.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Botão de Logout */}
      <div className="p-4 border-t border-holding-accent/30">
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 h-12 text-red-400 hover:text-red-300 hover:bg-red-500/20"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
}
