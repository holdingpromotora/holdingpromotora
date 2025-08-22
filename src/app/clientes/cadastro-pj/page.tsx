'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  CreditCard,
  Search,
  MapPin,
  User,
  Key,
  Mail,
  Phone,
  Calendar,
  Banknote,
  Building,
  Users,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Save,
} from 'lucide-react';

interface Banco {
  id: number;
  codigo: string;
  nome: string;
}

interface DadosReceita {
  razao_social: string;
  nome_fantasia: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export default function CadastroClientePessoaJuridicaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;

  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    representanteNome: '',
    representanteRg: '',
    representanteCpf: '',
    representanteDataNascimento: '',
    representanteEmail: '',
    representanteTelefone: '',
    bancoId: '',
    agencia: '',
    contaDigito: '',
    tipoConta: '',
    tipoPix: '',
    chavePix: '',
  });

  // Log do estado inicial
  useEffect(() => {
    console.log('🚀 Estado inicial do formulário PJ:', formData);
  }, []);

  const [bancos, setBancos] = useState<Banco[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar bancos do Supabase
  useEffect(() => {
    const carregarBancos = async () => {
      try {
        const { data: bancosData, error } = await supabase
          .from('bancos')
          .select('*')
          .eq('ativo', true)
          .order('nome');

        if (error) {
          console.error('Erro ao carregar bancos:', error);
          const bancosMock = [
            { id: 1, codigo: '001', nome: 'Banco do Brasil' },
            { id: 2, codigo: '104', nome: 'Caixa Econômica Federal' },
            { id: 3, codigo: '033', nome: 'Santander' },
            { id: 4, codigo: '341', nome: 'Itaú' },
            { id: 5, codigo: '237', nome: 'Bradesco' },
            { id: 6, codigo: '756', nome: 'Sicoob' },
            { id: 7, codigo: '748', nome: 'Sicredi' },
          ];
          setBancos(bancosMock);
        } else {
          setBancos(bancosData || []);
        }
      } catch (error) {
        console.error('Erro inesperado ao carregar bancos:', error);
        const bancosMock = [
          { id: 1, codigo: '001', nome: 'Banco do Brasil' },
          { id: 2, codigo: '104', nome: 'Caixa Econômica Federal' },
          { id: 3, codigo: '033', nome: 'Santander' },
          { id: 4, codigo: '341', nome: 'Itaú' },
          { id: 5, codigo: '237', nome: 'Bradesco' },
          { id: 6, codigo: '756', nome: 'Sicoob' },
          { id: 7, codigo: '748', nome: 'Sicredi' },
        ];
        setBancos(bancosMock);
      }
    };

    carregarBancos();
  }, []);

  // Carregar dados do cliente se for edição
  useEffect(() => {
    console.log('🔄 useEffect executado para edição');
    console.log('🆔 editId:', editId);
    console.log('📝 isEditing:', isEditing);

    const carregarClienteParaEdicao = async () => {
      if (!editId) {
        console.log('❌ editId não encontrado, saindo...');
        return;
      }

      try {
        setLoading(true);
        console.log('🔄 Carregando cliente PJ para edição, ID:', editId);

        const { data, error } = await supabase
          .from('pessoas_juridicas')
          .select('*')
          .eq('id', editId)
          .single();

        if (error) {
          console.error('❌ Erro ao carregar cliente para edição:', error);
          return;
        }

        console.log('✅ Dados carregados:', data);

        // Preencher formulário com dados existentes - mapeamento corrigido
        const novosDados = {
          cnpj: data.cnpj || '',
          razaoSocial: data.razao_social || '',
          nomeFantasia: data.nome_fantasia || '',
          cep: data.cep || '',
          endereco: data.endereco || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          representanteNome: data.proprietario_nome || '',
          representanteRg: data.proprietario_rg || '',
          representanteCpf: data.proprietario_cpf || '',
          representanteDataNascimento: data.proprietario_data_nascimento || '',
          representanteEmail: data.proprietario_email || '',
          representanteTelefone: data.proprietario_telefone || '',
          bancoId: data.banco_id?.toString() || '',
          agencia: data.agencia || '',
          contaDigito: data.conta_digito || '',
          tipoConta: data.tipo_conta || 'Corrente',
          tipoPix: data.tipo_pix || 'CNPJ',
          chavePix: data.chave_pix || '',
        };

        console.log('📝 Novos dados para o formulário:', novosDados);
        console.log('🔍 Verificando campos específicos:');
        console.log('  - CNPJ:', novosDados.cnpj);
        console.log('  - Razão Social:', novosDados.razaoSocial);
        console.log('  - Nome Fantasia:', novosDados.nomeFantasia);
        console.log('  - CEP:', novosDados.cep);
        console.log('  - Endereço:', novosDados.endereco);
        console.log('  - Cidade:', novosDados.cidade);
        console.log('  - Estado:', novosDados.estado);
        console.log('  - Representante Nome:', novosDados.representanteNome);
        console.log('  - Representante Email:', novosDados.representanteEmail);
        console.log('  - Banco ID:', novosDados.bancoId);

        setFormData(novosDados);
        console.log('✅ Formulário preenchido com dados');

        // Verificar se o estado foi atualizado
        setTimeout(() => {
          console.log('⏰ Estado após setFormData (timeout):', formData);
        }, 100);
      } catch (error) {
        console.error('❌ Erro ao carregar cliente para edição:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarClienteParaEdicao();
  }, [editId]);

  // Log do estado do formulário quando mudar
  useEffect(() => {
    console.log('📋 Estado atual do formulário PJ:', formData);
    console.log('🔍 Campos específicos:');
    console.log('  - CNPJ:', formData.cnpj);
    console.log('  - Razão Social:', formData.razaoSocial);
    console.log('  - Nome Fantasia:', formData.nomeFantasia);
    console.log('  - CEP:', formData.cep);
    console.log('  - Endereço:', formData.endereco);
    console.log('  - Cidade:', formData.cidade);
    console.log('  - Estado:', formData.estado);
    console.log('  - Representante Nome:', formData.representanteNome);
    console.log('  - Representante Email:', formData.representanteEmail);
    console.log('  - Banco ID:', formData.bancoId);
  }, [formData]);

  // Função para aplicar máscara no CNPJ
  const aplicarMascaraCNPJ = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  };

  // Função para aplicar máscara no RG
  const aplicarMascaraRG = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  };

  // Função para aplicar máscara no CPF
  const aplicarMascaraCPF = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para aplicar máscara no telefone
  const aplicarMascaraTelefone = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  // Função para aplicar máscara no CEP
  const aplicarMascaraCEP = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Função para aplicar máscara na conta com dígito
  const aplicarMascaraContaDigito = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length <= 8) {
      return apenasNumeros.replace(/(\d+)(\d{1})$/, '$1-$2');
    }
    return apenasNumeros.replace(/(\d+)(\d{1})$/, '$1-$2');
  };

  // Função para buscar CEP
  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  // Função para buscar CNPJ usando BrasilAPI
  const buscarCNPJ = async (cnpj: string) => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length === 14) {
      setIsLoadingCNPJ(true);
      try {
        console.log('🔍 Buscando dados do CNPJ:', cnpjLimpo);
        const response = await fetch(
          `https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Dados do CNPJ encontrados:', data);

          setFormData(prev => ({
            ...prev,
            razaoSocial: data.company_name || '',
            nomeFantasia: data.trade_name || data.company_name || '',
            cep: data.zip_code ? aplicarMascaraCEP(data.zip_code) : '',
            endereco: data.street || '',
            numero: data.number || '',
            complemento: data.complement || '',
            bairro: data.district || '',
            cidade: data.city || '',
            estado: data.state || '',
          }));
        } else {
          console.warn('⚠️ CNPJ não encontrado na BrasilAPI');
        }
      } catch (error) {
        console.error('❌ Erro ao buscar CNPJ:', error);
      } finally {
        setIsLoadingCNPJ(false);
      }
    }
  };

  // Atualizar PIX automaticamente baseado no tipo
  useEffect(() => {
    if (formData.tipoPix === 'CNPJ' && formData.cnpj) {
      setFormData(prev => ({
        ...prev,
        chavePix: prev.cnpj,
      }));
    } else if (formData.tipoPix === 'Email' && formData.representanteEmail) {
      setFormData(prev => ({
        ...prev,
        chavePix: prev.representanteEmail,
      }));
    } else if (
      formData.tipoPix === 'Telefone' &&
      formData.representanteTelefone
    ) {
      setFormData(prev => ({
        ...prev,
        chavePix: prev.representanteTelefone,
      }));
    }
  }, [
    formData.tipoPix,
    formData.cnpj,
    formData.representanteEmail,
    formData.representanteTelefone,
  ]);

  const handleInputChange = (field: string, value: string) => {
    let valorFormatado = value;

    switch (field) {
      case 'cnpj':
        valorFormatado = aplicarMascaraCNPJ(value);
        setFormData(prev => ({ ...prev, [field]: valorFormatado }));
        if (value.replace(/\D/g, '').length === 14) {
          buscarCNPJ(valorFormatado);
        }
        break;
      case 'representanteRg':
        valorFormatado = aplicarMascaraRG(value);
        setFormData(prev => ({ ...prev, [field]: valorFormatado }));
        break;
      case 'representanteCpf':
        valorFormatado = aplicarMascaraCPF(value);
        setFormData(prev => ({ ...prev, [field]: valorFormatado }));
        break;
      case 'representanteTelefone':
        valorFormatado = aplicarMascaraTelefone(value);
        setFormData(prev => ({ ...prev, [field]: valorFormatado }));
        break;
      case 'cep':
        valorFormatado = aplicarMascaraCEP(value);
        setFormData(prev => ({ ...prev, [field]: valorFormatado }));
        if (value.replace(/\D/g, '').length === 8) {
          buscarCEP(valorFormatado);
        }
        break;
      case 'contaDigito':
        valorFormatado = aplicarMascaraContaDigito(value);
        setFormData(prev => ({ ...prev, [field]: valorFormatado }));
        break;
      default:
        setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);

      const dadosParaSalvar = {
        cnpj: formData.cnpj.replace(/\D/g, ''),
        razao_social: formData.razaoSocial,
        nome_fantasia: formData.nomeFantasia,
        cep: formData.cep.replace(/\D/g, ''),
        endereco: formData.endereco,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        proprietario_nome: formData.representanteNome,
        proprietario_rg: formData.representanteRg.replace(/\D/g, ''),
        proprietario_cpf: formData.representanteCpf.replace(/\D/g, ''),
        proprietario_data_nascimento: formData.representanteDataNascimento,
        proprietario_email: formData.representanteEmail,
        proprietario_telefone: formData.representanteTelefone.replace(
          /\D/g,
          ''
        ),
        banco_id: formData.bancoId ? parseInt(formData.bancoId) : null,
        agencia: formData.agencia,
        conta_digito: formData.contaDigito,
        tipo_conta: formData.tipoConta,
        tipo_pix: formData.tipoPix,
        chave_pix: formData.chavePix,
      };

      let result;

      if (isEditing && editId) {
        // Atualizar cliente existente
        const { data, error } = await supabase
          .from('pessoas_juridicas')
          .update({
            ...dadosParaSalvar,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editId)
          .select();

        if (error) {
          console.error('Erro ao atualizar:', error);
          setDialogMessage(`Erro ao atualizar cliente: ${error.message}`);
          setShowErrorDialog(true);
          return;
        }

        result = data;
        setDialogMessage('Cliente Pessoa Jurídica atualizado com sucesso!');
      } else {
        // Inserir novo cliente
        const { data, error } = await supabase
          .from('pessoas_juridicas')
          .insert([dadosParaSalvar])
          .select();

        if (error) {
          console.error('Erro ao salvar:', error);
          setDialogMessage(`Erro ao cadastrar cliente: ${error.message}`);
          setShowErrorDialog(true);
          return;
        }

        result = data;
        setDialogMessage('Cliente Pessoa Jurídica cadastrado com sucesso!');
      }

      if (result && result.length > 0) {
        setShowSuccessDialog(true);
      } else {
        setDialogMessage('Erro: Nenhum dado foi retornado da operação');
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setDialogMessage(
        'Erro inesperado ao processar cliente. Tente novamente.'
      );
      setShowErrorDialog(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    // Resetar formulário
    setFormData({
      cnpj: '',
      razaoSocial: '',
      nomeFantasia: '',
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      representanteNome: '',
      representanteRg: '',
      representanteCpf: '',
      representanteDataNascimento: '',
      representanteEmail: '',
      representanteTelefone: '',
      bancoId: '',
      agencia: '',
      contaDigito: '',
      tipoConta: '',
      tipoPix: '',
      chavePix: '',
    });
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen holding-layout">
      {/* Sidebar Recolhível */}
      <div
        className={`holding-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}
      >
        <nav className="flex flex-col items-center py-8 space-y-6">
          {/* Botão Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg mb-8"
            onClick={toggleSidebar}
            title={sidebarExpanded ? 'Recolher Menu' : 'Expandir Menu'}
          >
            {sidebarExpanded ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>

          {/* Logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-medium to-holding-blue-light rounded-xl flex items-center justify-center mb-8">
            <Shield className="w-6 h-6 text-holding-white" />
          </div>

          {/* Navegação Principal */}
          <Button
            variant="ghost"
            size="sm"
            className={`${
              sidebarExpanded
                ? 'w-full justify-start px-4'
                : 'w-12 justify-center'
            } h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg`}
            onClick={() => router.push('/dashboard')}
            title="Dashboard"
          >
            <BarChart3 className="w-5 h-5" />
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-medium">Dashboard</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`${
              sidebarExpanded
                ? 'w-full justify-start px-4'
                : 'w-12 justify-center'
            } h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg`}
            onClick={() => router.push('/usuarios')}
            title="Usuários"
          >
            <Users className="w-5 h-5" />
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-medium">Usuários</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`${
              sidebarExpanded
                ? 'w-full justify-start px-4'
                : 'w-12 justify-center'
            } h-12 p-0 text-holding-white hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg bg-holding-blue-light/20`}
            onClick={() => router.push('/clientes')}
            title="Clientes"
          >
            <Building className="w-5 h-5" />
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-medium">Clientes</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`${
              sidebarExpanded
                ? 'w-full justify-start px-4'
                : 'w-12 justify-center'
            } h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg`}
            onClick={() => router.push('/settings')}
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-medium">Configurações</span>
            )}
          </Button>

          {/* Logout */}
          <div
            className={`pt-8 border-t border-holding-blue-light/30 ${
              sidebarExpanded ? 'w-full' : 'w-8'
            }`}
          >
            <Button
              variant="ghost"
              size="sm"
              className={`${
                sidebarExpanded
                  ? 'w-full justify-start px-4'
                  : 'w-12 justify-center'
              } h-12 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg`}
              onClick={() => {
                console.log('Logout solicitado');
                if (confirm('Tem certeza que deseja sair do sistema?')) {
                  localStorage.removeItem('holding_user');
                  window.location.href = '/login';
                }
              }}
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
              {sidebarExpanded && (
                <span className="ml-3 text-sm font-medium">Sair</span>
              )}
            </Button>
          </div>
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div
        className={`transition-all duration-300 ${sidebarExpanded ? 'pl-80' : 'pl-24'} p-8 space-y-8`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-holding-white">
                {isEditing
                  ? 'Editar Cliente - Pessoa Jurídica'
                  : 'Cadastro de Cliente - Pessoa Jurídica'}
              </h1>
              <p className="text-holding-accent-light mt-2">
                {isEditing
                  ? 'Edite os dados do cliente pessoa jurídica selecionado'
                  : 'Preencha os dados para cadastrar um novo cliente pessoa jurídica'}
              </p>
              {isEditing && loading && (
                <div className="flex items-center space-x-2 mt-2 text-holding-blue-light">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-holding-blue-light"></div>
                  <span>Carregando dados do cliente...</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dados da Empresa */}
              <Card className="glass-effect-accent border-holding-accent/30">
                <CardHeader>
                  <CardTitle className="text-holding-white flex items-center space-x-3">
                    <Building className="w-5 h-5 text-holding-highlight" />
                    <span>Dados da Empresa</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>CNPJ *</span>
                    </Label>
                    <div className="relative">
                      <Input
                        value={formData.cnpj}
                        onChange={e =>
                          handleInputChange('cnpj', e.target.value)
                        }
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        required
                      />
                      {isLoadingCNPJ && (
                        <Search className="absolute right-3 top-3 w-4 h-4 text-holding-accent-light animate-spin" />
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Razão Social *</span>
                    </Label>
                    <Input
                      value={formData.razaoSocial}
                      onChange={e =>
                        handleInputChange('razaoSocial', e.target.value)
                      }
                      placeholder="Razão social da empresa"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Nome Fantasia</span>
                    </Label>
                    <Input
                      value={formData.nomeFantasia}
                      onChange={e =>
                        handleInputChange('nomeFantasia', e.target.value)
                      }
                      placeholder="Nome fantasia da empresa"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card className="glass-effect-accent border-holding-accent/30">
                <CardHeader>
                  <CardTitle className="text-holding-white flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-holding-highlight" />
                    <span>Endereço</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>CEP</span>
                    </Label>
                    <Input
                      value={formData.cep}
                      onChange={e => handleInputChange('cep', e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                    />
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Endereço</span>
                    </Label>
                    <Input
                      value={formData.endereco}
                      onChange={e =>
                        handleInputChange('endereco', e.target.value)
                      }
                      placeholder="Rua, Avenida, etc."
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Número</span>
                      </Label>
                      <Input
                        value={formData.numero}
                        onChange={e =>
                          handleInputChange('numero', e.target.value)
                        }
                        placeholder="123"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Complemento</span>
                      </Label>
                      <Input
                        value={formData.complemento}
                        onChange={e =>
                          handleInputChange('complemento', e.target.value)
                        }
                        placeholder="Apto, Sala, etc."
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Bairro</span>
                      </Label>
                      <Input
                        value={formData.bairro}
                        onChange={e =>
                          handleInputChange('bairro', e.target.value)
                        }
                        placeholder="Nome do bairro"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Cidade</span>
                      </Label>
                      <Input
                        value={formData.cidade}
                        onChange={e =>
                          handleInputChange('cidade', e.target.value)
                        }
                        placeholder="Nome da cidade"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Estado</span>
                    </Label>
                    <Input
                      value={formData.estado}
                      onChange={e =>
                        handleInputChange('estado', e.target.value)
                      }
                      placeholder="UF"
                      maxLength={2}
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dados do Representante Legal */}
                <Card className="glass-effect-accent border-holding-accent/30">
                  <CardHeader>
                    <CardTitle className="text-holding-white flex items-center space-x-3">
                      <User className="w-5 h-5 text-holding-highlight" />
                      <span>Dados do Representante Legal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Nome Completo *</span>
                      </Label>
                      <Input
                        value={formData.representanteNome}
                        onChange={e =>
                          handleInputChange('representanteNome', e.target.value)
                        }
                        placeholder="Nome completo do representante"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                          <CreditCard className="w-4 h-4" />
                          <span>RG</span>
                        </Label>
                        <Input
                          value={formData.representanteRg}
                          onChange={e =>
                            handleInputChange('representanteRg', e.target.value)
                          }
                          placeholder="00.000.000-0"
                          className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        />
                      </div>

                      <div>
                        <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                          <CreditCard className="w-4 h-4" />
                          <span>CPF *</span>
                        </Label>
                        <Input
                          value={formData.representanteCpf}
                          onChange={e =>
                            handleInputChange(
                              'representanteCpf',
                              e.target.value
                            )
                          }
                          placeholder="000.000.000-00"
                          maxLength={14}
                          className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Data de Nascimento</span>
                      </Label>
                      <Input
                        type="date"
                        value={formData.representanteDataNascimento}
                        onChange={e =>
                          handleInputChange(
                            'representanteDataNascimento',
                            e.target.value
                          )
                        }
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white"
                      />
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email *</span>
                      </Label>
                      <Input
                        type="email"
                        value={formData.representanteEmail}
                        onChange={e =>
                          handleInputChange(
                            'representanteEmail',
                            e.target.value
                          )
                        }
                        placeholder="email@exemplo.com"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Telefone</span>
                      </Label>
                      <Input
                        value={formData.representanteTelefone}
                        onChange={e =>
                          handleInputChange(
                            'representanteTelefone',
                            e.target.value
                          )
                        }
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Dados Bancários */}
                <Card className="glass-effect-accent border-holding-accent/30">
                  <CardHeader>
                    <CardTitle className="text-holding-white flex items-center space-x-3">
                      <Banknote className="w-5 h-5 text-holding-highlight" />
                      <span>Dados Bancários</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <Banknote className="w-4 h-4" />
                        <span>Banco</span>
                      </Label>
                      <select
                        value={formData.bancoId}
                        onChange={e =>
                          handleInputChange('bancoId', e.target.value)
                        }
                        className="mt-1 w-full p-2 bg-holding-secondary border border-holding-accent/30 text-holding-white rounded-md"
                      >
                        <option value="">Selecione o banco</option>
                        {bancos.map(banco => (
                          <option key={banco.id} value={banco.id}>
                            {banco.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                          <Banknote className="w-4 h-4" />
                          <span>Agência</span>
                        </Label>
                        <Input
                          value={formData.agencia}
                          onChange={e =>
                            handleInputChange('agencia', e.target.value)
                          }
                          placeholder="0000"
                          maxLength={4}
                          className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        />
                      </div>

                      <div>
                        <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                          <Banknote className="w-4 h-4" />
                          <span>Conta com Dígito</span>
                        </Label>
                        <Input
                          value={formData.contaDigito}
                          onChange={e =>
                            handleInputChange('contaDigito', e.target.value)
                          }
                          placeholder="Conta-Dígito (ex: 12345-6)"
                          className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                          <Banknote className="w-4 h-4" />
                          <span>Tipo de Conta</span>
                        </Label>
                        <select
                          value={formData.tipoConta}
                          onChange={e =>
                            handleInputChange('tipoConta', e.target.value)
                          }
                          className="mt-1 w-full p-2 bg-holding-secondary border border-holding-accent/30 text-holding-white rounded-md"
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="Corrente">Corrente</option>
                          <option value="Poupança">Poupança</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                          <Key className="w-4 h-4" />
                          <span>Tipo PIX</span>
                        </Label>
                        <select
                          value={formData.tipoPix}
                          onChange={e =>
                            handleInputChange('tipoPix', e.target.value)
                          }
                          className="mt-1 w-full p-2 bg-holding-secondary border border-holding-accent/30 text-holding-white rounded-md"
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="CPF">CPF</option>
                          <option value="CNPJ">CNPJ</option>
                          <option value="Email">Email</option>
                          <option value="Telefone">Telefone</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <Key className="w-4 h-4" />
                        <span>Chave PIX</span>
                      </Label>
                      <Input
                        value={formData.chavePix}
                        onChange={e =>
                          handleInputChange('chavePix', e.target.value)
                        }
                        placeholder="Chave PIX"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                className="holding-btn-primary"
                disabled={isLoadingCNPJ || saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving
                  ? isEditing
                    ? 'Atualizando...'
                    : 'Salvando...'
                  : isEditing
                    ? 'Atualizar Cliente'
                    : 'Salvar Cliente'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Diálogos de Sucesso e Erro */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditing ? 'Cliente Atualizado!' : 'Sucesso!'}
            </AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowSuccessDialog(false);
                if (isEditing) {
                  router.push('/clientes');
                } else {
                  handleSuccessClose();
                }
              }}
            >
              {isEditing ? 'Voltar aos Clientes' : 'OK'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Erro</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
