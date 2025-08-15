'use client';

import { Button } from '@/components/ui/button';
import { Building2, Home, Users, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TestSidebar() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-screen w-64 bg-gray-800 border-r border-gray-700">
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-64 bg-gray-800 border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">HP</span>
        </div>
      </div>

      {/* Perfil do Usuário */}
      <div className="p-4 border-b border-gray-700">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
              AG
            </div>
            <div>
              <p className="text-white font-medium text-sm">Armandogomes</p>
              <p className="text-gray-400 text-xs">
                grupoarmandogomes@gmail.com
              </p>
              <p className="text-blue-400 text-xs font-medium">
                Usuário Master
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        <Button className="w-full justify-start space-x-3 h-12 bg-red-600 text-white hover:bg-red-700">
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 h-12 text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Users className="w-5 h-5" />
          <span>Clientes</span>
        </Button>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 h-12 text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
}
