'use client';

import React from 'react';

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Página de Teste Simples
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Teste de Funcionamento
          </h2>
          
          <p className="text-gray-600 mb-4">
            Esta é uma página de teste simples para verificar se o Next.js está funcionando corretamente.
          </p>
          
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Página carregada com sucesso!
          </div>
        </div>
      </div>
    </div>
  );
}
