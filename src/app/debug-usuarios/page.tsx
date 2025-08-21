'use client';

import React from 'react';
import { UsuariosService } from '@/lib/usuarios-service';

export default function DebugUsuariosPage() {
  const [resultado, setResultado] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const testarConexao = async () => {
    try {
      setLoading(true);
      console.log('🧪 Testando serviço de usuários...');

      const usuarios = await UsuariosService.buscarUsuarios();
      const stats = await UsuariosService.buscarEstatisticas();

      setResultado({
        success: true,
        usuarios,
        stats,
        total: usuarios.length,
      });
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setResultado({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  const testarAPI = async () => {
    try {
      setLoading(true);
      console.log('🧪 Testando API diretamente...');

      const response = await fetch('/api/test-usuarios');
      const data = await response.json();

      setResultado({
        success: true,
        apiTest: true,
        data,
      });
    } catch (error) {
      console.error('❌ Erro no teste da API:', error);
      setResultado({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Debug - Teste de Conexão com Usuários
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Testes de Conectividade
          </h2>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={testarConexao}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Testando...' : 'Testar Serviço de Usuários'}
            </button>

            <button
              onClick={testarAPI}
              disabled={loading}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Testando...' : 'Testar API Diretamente'}
            </button>
          </div>

          {resultado && (
            <div className="bg-gray-50 rounded p-4">
              <h3 className="font-semibold mb-2">Resultado:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(resultado, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Instruções de Debug
          </h2>

          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Abra o console do navegador (F12)</li>
            <li>
              Clique em &quot;Testar Serviço de Usuários&quot; para testar a conexão via
              React
            </li>
            <li>Clique em &quot;Testar API Diretamente&quot; para testar a API REST</li>
            <li>Verifique os logs no console para mais detalhes</li>
            <li>Se houver erros, verifique a configuração do Supabase</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
