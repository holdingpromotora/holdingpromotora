'use client'

import TestSidebar from '@/components/TestSidebar'

export default function TestPage() {
  return (
    <div className="flex h-screen bg-gray-900">
      <TestSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          🧪 Página de Teste
        </h1>
        <p className="text-gray-300 text-lg">
          Se você está vendo esta página, os componentes estão funcionando!
        </p>
        <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            ✅ Componentes Funcionando:
          </h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Sidebar com menu lateral</li>
            <li>• Perfil do usuário</li>
            <li>• Navegação entre páginas</li>
            <li>• Layout responsivo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
