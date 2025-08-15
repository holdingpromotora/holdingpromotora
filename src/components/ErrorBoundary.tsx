'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen holding-gradient flex items-center justify-center p-4">
          <div className="text-center text-holding-white">
            <h1 className="text-2xl font-bold mb-4">Algo deu errado</h1>
            <p className="text-holding-accent-light mb-4">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white px-4 py-2 rounded-lg"
            >
              Recarregar Página
            </button>
            {this.state.error && (
              <details className="mt-4 text-left text-sm">
                <summary className="cursor-pointer text-holding-accent-light">
                  Detalhes do erro
                </summary>
                <pre className="mt-2 p-2 bg-holding-accent/20 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
