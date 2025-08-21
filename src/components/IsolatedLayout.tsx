'use client';

interface IsolatedLayoutProps {
  children: React.ReactNode;
}

export default function IsolatedLayout({ children }: IsolatedLayoutProps) {
  return <div className="min-h-screen holding-layout">{children}</div>;
}
