'use client';

interface IsolatedLayoutProps {
  children: React.ReactNode;
}

export default function IsolatedLayout({ children }: IsolatedLayoutProps) {
  return (
    <div className="min-h-screen holding-gradient">
      <div className="flex">
        {/* Sidebar isolado */}
        <div className="w-64 bg-holding-secondary/50 backdrop-blur-sm border-r border-holding-accent/30 min-h-screen p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-holding-white mb-2">
              Holding Promotora
            </h1>
            <p className="text-holding-accent-light text-sm">
              Sistema de Cadastro
            </p>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
