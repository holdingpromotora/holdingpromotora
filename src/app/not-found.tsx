import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen holding-gradient flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-holding-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-holding-white mb-4">
          Página não encontrada
        </h2>
        <p className="text-holding-accent-light mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
