'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('❌ Erro global capturado:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen holding-gradient flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold text-holding-white mb-3">
              Erro Crítico!
            </h1>

            <p className="text-holding-accent-light mb-6 text-lg">
              Ocorreu um erro crítico na aplicação. O sistema pode estar
              instável.
            </p>

            <div className="space-y-3">
              <Button
                onClick={reset}
                className="w-full bg-holding-highlight hover:bg-holding-highlight-light text-holding-white py-3"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Tentar Recarregar
              </Button>

              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                className="w-full border-holding-accent/30 text-holding-white hover:bg-holding-accent/20 py-3"
              >
                <Home className="w-5 h-5 mr-2" />
                Página Inicial
              </Button>
            </div>

            {error.digest && (
              <p className="text-xs text-holding-accent-light mt-6">
                ID do erro: {error.digest}
              </p>
            )}

            <p className="text-xs text-holding-accent-light mt-4">
              Se o problema persistir, entre em contato com o suporte técnico.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
