'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, AuthContextType } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import {
  getUserPermissions,
  hasUserPermission,
  hasUserPermissionAction,
} from '@/lib/permissions-config';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const hasApprovedProfile = user?.aprovado && user?.ativo && user?.perfil_id;

  useEffect(() => {
    console.log('🔄 AuthContext: Iniciando verificação de usuário...');
    
    const checkUser = async () => {
      try {
        // Verificar se há usuário logado no localStorage
        if (typeof window !== 'undefined') {
          const savedUser = localStorage.getItem('holding_user');
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              console.log(
                '✅ AuthContext: Usuário encontrado no localStorage:',
                userData
              );
              
              // Validar se o usuário ainda é válido
              if (userData && userData.email && userData.id !== undefined) {
                setUser(userData);
                console.log('✅ AuthContext: Usuário válido definido');
              } else {
                console.warn('⚠️ AuthContext: Dados do usuário inválidos, removendo...');
                localStorage.removeItem('holding_user');
                setUser(null);
              }
            } catch (error) {
              console.error('❌ AuthContext: Erro ao parsear usuário:', error);
              localStorage.removeItem('holding_user');
              setUser(null);
            }
          } else {
            console.log(
              'ℹ️ AuthContext: Nenhum usuário encontrado no localStorage'
            );
            setUser(null);
          }
        } else {
          console.log(
            'ℹ️ AuthContext: Executando no servidor, pulando localStorage'
          );
          setUser(null);
        }
      } catch (error) {
        console.error('❌ AuthContext: Erro durante verificação:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log('✅ AuthContext: Verificação concluída');
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Iniciando login...');
      setIsLoading(true);

      // Verificar se é o usuário master original
      if (email === 'grupoarmandogomes@gmail.com' && password === '@252980Hol') {
        const userData: User = {
          id: 0,
          email: 'grupoarmandogomes@gmail.com',
          nome: 'Usuário Master',
          perfil_id: '1',
          perfil_nome: 'Master',
          aprovado: true,
          ativo: true,
          status: 'aprovado',
        };
        
        console.log('✅ AuthContext: Login bem-sucedido para usuário master original');
        setUser(userData);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('holding_user', JSON.stringify(userData));
          console.log('💾 AuthContext: Usuário master salvo no localStorage');
        }
        
        return { success: true, user: userData };
      }

      // Simular verificação de credenciais
      if (email === 'admin@holding.com' && password === 'admin123') {
        const userData: User = {
          id: 0,
          email: 'admin@holding.com',
          nome: 'Administrador Master',
          perfil_id: '1',
          perfil_nome: 'Master',
          aprovado: true,
          ativo: true,
          status: 'aprovado',
        };
        
        console.log('✅ AuthContext: Login bem-sucedido para usuário master');
        setUser(userData);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('holding_user', JSON.stringify(userData));
          console.log('💾 AuthContext: Usuário salvo no localStorage');
        }
        
        return { success: true, user: userData };
      }

      // Simular verificação de usuário normal
      if (email === 'maria@holding.com' && password === 'maria123') {
        const userData: User = {
          id: 2,
          email: 'maria@holding.com',
          nome: 'Maria Santos',
          perfil_id: '2',
          perfil_nome: 'Administrador',
          aprovado: true,
          ativo: true,
          status: 'aprovado',
        };
        
        console.log('✅ AuthContext: Login bem-sucedido para usuário normal');
        setUser(userData);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('holding_user', JSON.stringify(userData));
          console.log('💾 AuthContext: Usuário salvo no localStorage');
        }
        
        return { success: true, user: userData };
      }

      // Simular usuário pendente
      if (email === 'carlos@holding.com' && password === 'carlos123') {
        const userData: User = {
          id: 5,
          email: 'carlos@holding.com',
          nome: 'Carlos Ferreira',
          perfil_id: '',
          perfil_nome: 'Sem perfil',
          aprovado: false,
          ativo: false,
          status: 'pendente',
        };
        
        console.log('⚠️ AuthContext: Login para usuário pendente');
        setUser(userData);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('holding_user', JSON.stringify(userData));
          console.log('💾 AuthContext: Usuário pendente salvo no localStorage');
        }
        
        return { success: true, user: userData, pending: true };
      }

      // Simular usuário rejeitado
      if (email === 'ana@holding.com' && password === 'ana123') {
        const userData: User = {
          id: 4,
          email: 'ana@holding.com',
          nome: 'Ana Oliveira',
          perfil_id: '6',
          perfil_nome: 'Visualizador',
          aprovado: false,
          ativo: false,
          status: 'rejeitado',
        };
        
        console.log('❌ AuthContext: Login para usuário rejeitado');
        setUser(userData);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('holding_user', JSON.stringify(userData));
          console.log('💾 AuthContext: Usuário rejeitado salvo no localStorage');
        }
        
        return { success: true, user: userData, rejected: true };
      }

      console.log('❌ AuthContext: Credenciais inválidas');
      return { success: false, error: 'Credenciais inválidas' };
    } catch (error) {
      console.error('❌ AuthContext: Erro durante login:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
      console.log('✅ AuthContext: Login finalizado');
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext: Fazendo logout...');
    setUser(null);
    localStorage.removeItem('holding_user');
    console.log('✅ AuthContext: Logout realizado');
  };

  const value = {
    user,
    isAuthenticated,
    hasApprovedProfile,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
