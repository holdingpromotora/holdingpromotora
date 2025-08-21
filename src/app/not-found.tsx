'use client';

import { Button } from '@/components/ui/button';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-holding-primary flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-holding-accent/20 rounded-full flex items-center justify-center mx-auto">
          <Search className="w-10 h-10 text-holding-accent-light" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-holding-white">
            Página não encontrada
          </h1>
          <p className="text-holding-accent-light">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.back()}
            className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="border-holding-accent/30 text-holding-accent-light hover:bg-holding-accent/20"
          >
            <Home className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>
        </div>

        <div className="text-sm text-holding-accent-light">
          <p>Erro 404 - Página não encontrada</p>
        </div>
      </div>
    </div>
  );
}
