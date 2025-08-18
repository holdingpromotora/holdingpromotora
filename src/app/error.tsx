'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('❌ Erro capturado:', error);
  }, [error]);

  return (
    <div className="min-h-screen holding-gradient flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-holding-white mb-2">
          Algo deu errado!
        </h2>

        <p className="text-holding-accent-light mb-6">
          Ocorreu um erro inesperado. Tente novamente ou entre em contato com o
          suporte.
        </p>

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full bg-holding-highlight hover:bg-holding-highlight-light text-holding-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>

          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="w-full border-holding-accent/30 text-holding-white hover:bg-holding-accent/20"
          >
            Voltar ao Início
          </Button>
        </div>

        {error.digest && (
          <p className="text-xs text-holding-accent-light mt-4">
            ID do erro: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
