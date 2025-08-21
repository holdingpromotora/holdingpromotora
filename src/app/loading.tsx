export default function Loading() {
  return (
    <div className="min-h-screen bg-holding-primary flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-holding-accent/30 border-t-holding-highlight rounded-full animate-spin mx-auto"></div>
        <div className="text-holding-accent-light">
          <p className="text-lg font-medium">Carregando...</p>
          <p className="text-sm">Aguarde um momento</p>
        </div>
      </div>
    </div>
  );
}
