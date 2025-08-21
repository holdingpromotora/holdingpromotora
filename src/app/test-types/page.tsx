'use client';

import React, { useState, useEffect } from 'react';

export default function TestTypesPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Teste de Tipos
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Teste de Hooks React
          </h2>

          <p className="text-gray-600 mb-4">Contador: {count}</p>

          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Incrementar
          </button>
        </div>
      </div>
    </div>
  );
}
