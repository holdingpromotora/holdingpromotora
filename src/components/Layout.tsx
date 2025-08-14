'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString('pt-BR'))
  }, [])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="flex h-screen bg-holding-primary">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
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
                Último acesso: {currentTime}
              </div>
            </div>
          </div>
        </header>
        
        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-auto bg-holding-primary">
          {children}
        </main>
      </div>
    </div>
  )
}
