'use client'

import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, Calculator, FileText, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Título da Página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-holding-white mb-2">
              Dashboard
            </h1>
            <p className="text-holding-accent-light">
              Visão geral do sistema de crédito consignado
            </p>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-holding-highlight/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-holding-highlight/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-holding-highlight" />
                  </div>
                  <div>
                    <p className="text-holding-accent-light text-sm">Total de Clientes</p>
                    <p className="text-2xl font-bold text-holding-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-holding-highlight/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-holding-highlight/20 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-holding-highlight" />
                  </div>
                  <div>
                    <p className="text-holding-accent-light text-sm">Simulações</p>
                    <p className="text-2xl font-bold text-holding-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-holding-highlight/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-holding-highlight/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-holding-highlight" />
                  </div>
                  <div>
                    <p className="text-holding-accent-light text-sm">Propostas</p>
                    <p className="text-2xl font-bold text-holding-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-holding-highlight/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-holding-highlight/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-holding-highlight" />
                  </div>
                  <div>
                    <p className="text-holding-accent-light text-sm">Valor Total</p>
                    <p className="text-2xl font-bold text-holding-white">R$ 0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Principal */}
          <Card className="glass-effect border-holding-highlight/30">
            <CardHeader>
              <CardTitle className="text-2xl text-holding-white flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-holding-highlight" />
                <span>Bem-vindo ao Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-holding-highlight/10 border border-holding-highlight/30 rounded-lg p-4">
                  <p className="text-holding-highlight font-medium">
                    ✅ Usuário Master autenticado: grupoarmandogomes@gmail.com
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-holding-accent/10 border border-holding-accent/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-holding-highlight">0</div>
                    <div className="text-holding-accent-light text-sm">Propostas Pendentes</div>
                  </div>
                  
                  <div className="bg-holding-accent/10 border border-holding-accent/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-holding-highlight">0</div>
                    <div className="text-holding-accent-light text-sm">Propostas Aprovadas</div>
                  </div>
                  
                  <div className="bg-holding-accent/10 border border-holding-accent/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-holding-highlight">0</div>
                    <div className="text-holding-accent-light text-sm">Propostas Rejeitadas</div>
                  </div>
                </div>
                
                <div className="text-center text-holding-accent-light text-sm">
                  Sistema em desenvolvimento - Funcionalidades serão implementadas em breve
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
