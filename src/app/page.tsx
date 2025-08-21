import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Users,
  Building,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Users as UsersIcon,
  Building as BuildingIcon,
  FileText,
  Settings,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: UsersIcon,
      title: 'Gestão de Usuários',
      description:
        'Cadastro e controle completo de usuários do sistema com diferentes níveis de acesso.',
      color: 'from-holding-blue-medium/20 to-holding-blue-light/20',
    },
    {
      icon: BuildingIcon,
      title: 'Gestão de Clientes',
      description:
        'Sistema completo para cadastro de clientes Pessoa Física e Jurídica.',
      color: 'from-holding-blue-light/20 to-holding-blue-medium/20',
    },
    {
      icon: FileText,
      title: 'Relatórios Avançados',
      description:
        'Geração de relatórios detalhados e análises para tomada de decisão.',
      color: 'from-holding-blue-dark/20 to-holding-blue-deep/20',
    },
    {
      icon: Settings,
      title: 'Configurações Flexíveis',
      description:
        'Personalização completa do sistema conforme suas necessidades.',
      color: 'from-holding-blue-medium/20 to-holding-blue-light/20',
    },
  ];

  const stats = [
    { label: 'Usuários Ativos', value: '150+', icon: Users },
    { label: 'Clientes Cadastrados', value: '2.8K+', icon: Building },
    { label: 'Operações Realizadas', value: '15K+', icon: BarChart3 },
    { label: 'Taxa de Aprovação', value: '94%', icon: TrendingUp },
  ];

  const benefits = [
    'Interface moderna e intuitiva',
    'Segurança de dados de nível empresarial',
    'Suporte técnico especializado',
    'Atualizações regulares do sistema',
    'Integração com APIs externas',
    'Backup automático dos dados',
  ];

  return (
    <div className="min-h-screen holding-layout">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-holding-blue-profound/50 via-holding-blue-deep/30 to-holding-blue-dark/50"></div>

        <div className="relative z-10 px-6 py-24 mx-auto max-w-7xl">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-holding-blue-medium to-holding-blue-light rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-holding-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-holding-white mb-6">
              Holding Promotora
            </h1>

            <p className="text-xl md:text-2xl text-holding-blue-light mb-8 max-w-3xl mx-auto">
              Sistema moderno e completo para gestão de clientes, usuários e
              operações financeiras. Desenvolvido com as melhores práticas de
              segurança e usabilidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button className="holding-btn-primary text-lg px-8 py-4">
                  Acessar Sistema
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/usuarios/cadastro-pf">
                <Button className="holding-btn-secondary text-lg px-8 py-4">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="holding-stat-card text-center holding-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-holding-blue-medium/20 to-holding-blue-light/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-holding-blue-light" />
                </div>
                <h3 className="text-3xl font-bold text-holding-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-holding-blue-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recursos */}
      <div className="px-6 py-16 bg-gradient-to-br from-holding-blue-dark/20 to-holding-blue-deep/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-holding-white mb-4">
              Recursos Principais
            </h2>
            <p className="text-xl text-holding-blue-light max-w-2xl mx-auto">
              Nossa plataforma oferece todas as ferramentas necessárias para uma
              gestão eficiente e profissional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="holding-card p-6 text-center holding-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-holding-blue-light" />
                </div>
                <h3 className="text-xl font-bold text-holding-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-holding-blue-light text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefícios */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="holding-fade-in">
              <h2 className="text-4xl font-bold text-holding-white mb-6">
                Por que escolher nossa plataforma?
              </h2>
              <p className="text-lg text-holding-blue-light mb-8">
                Desenvolvemos uma solução completa que atende às necessidades
                específicas do setor financeiro, com foco em segurança,
                eficiência e usabilidade.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-holding-blue-light flex-shrink-0" />
                    <span className="text-holding-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="holding-scale-in">
              <div className="holding-card p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-holding-blue-medium to-holding-blue-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-holding-white" />
                </div>
                <h3 className="text-2xl font-bold text-holding-white mb-4">
                  Certificação de Qualidade
                </h3>
                <p className="text-holding-blue-light mb-6">
                  Nossa plataforma atende aos mais altos padrões de qualidade e
                  segurança do mercado.
                </p>
                <div className="flex justify-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-holding-blue-light fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="px-6 py-16 bg-gradient-to-br from-holding-blue-dark/30 to-holding-blue-deep/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-holding-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-holding-blue-light mb-8">
            Junte-se a centenas de empresas que já confiam em nossa plataforma
            para gerenciar seus clientes e operações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button className="holding-btn-primary text-lg px-8 py-4">
                Acessar Sistema
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/usuarios/cadastro-pf">
              <Button className="holding-btn-secondary text-lg px-8 py-4">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
