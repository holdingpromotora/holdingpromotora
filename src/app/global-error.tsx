'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erro global capturado:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-holding-primary flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-holding-white">
                Erro Crítico do Sistema
              </h1>
              <p className="text-holding-accent-light">
                Ocorreu um erro crítico que afetou todo o sistema. 
                Tente recarregar a página ou entre em contato com o suporte.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={reset}
                className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-holding-accent/30 text-holding-accent-light hover:bg-holding-accent/20"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-holding-secondary/50 p-4 rounded-lg border border-holding-accent/30">
                <summary className="text-holding-accent-light cursor-pointer font-medium">
                  Detalhes do Erro (Desenvolvimento)
                </summary>
                <pre className="text-red-400 text-sm mt-2 whitespace-pre-wrap">
                  {error.message}
                </pre>
                {error.stack && (
                  <pre className="text-holding-accent-light text-xs mt-2 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
