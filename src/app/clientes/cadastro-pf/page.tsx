'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  User,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard as CreditCardIcon,
  Key,
  Save,
  Search,
  Home,
  Users as UsersIcon,
  Building as BuildingIcon,
  Settings,
  LogOut,
  Users,
  Shield,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
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

interface Banco {
  id: number;
  codigo: string;
  nome: string;
}

export default function CadastroClientePessoaFisicaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    nomeMae: '',
    rg: '',
    cpf: '',
    numeroBeneficioMatricula: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    bancoId: '',
    agencia: '',
    contaDigito: '',
    tipoConta: 'Corrente',
    tipoPix: 'CPF',
    chavePix: '',
  });

  const [bancos, setBancos] = useState<Banco[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

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
      }
    };

    carregarBancos();
  }, []);

  // Máscaras
  const aplicarMascaraRG = (valor: string) => {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  };

  const aplicarMascaraCPF = (valor: string) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    if (numeros.length === 0) return '';
    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6)
      return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9)
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
  };

  const aplicarMascaraTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    if (numeros.length === 0) return '';
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  };

  const aplicarMascaraCEP = (valor: string) => {
    return valor.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const aplicarMascaraConta = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 1) return numeros;
    const conta = numeros.slice(0, -1);
    const digito = numeros.slice(-1);
    return `${conta}-${digito}`;
  };

  // Buscar CEP automaticamente
  const buscarCEP = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
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
        console.log('Erro ao buscar CEP:', error);
      }
    }
  };

  // Preencher automaticamente chave PIX
  useEffect(() => {
    if (
      formData.tipoPix &&
      (formData.cpf || formData.telefone || formData.email)
    ) {
      let chave = '';
      switch (formData.tipoPix) {
        case 'CPF':
          chave = formData.cpf || '';
          break;
        case 'Telefone':
          chave = formData.telefone || '';
          break;
        case 'E-mail':
          chave = formData.email || '';
          break;
        default:
          chave = '';
      }
      if (chave) {
        setFormData(prev => ({ ...prev, chavePix: chave }));
      }
    }
  }, [formData.tipoPix, formData.cpf, formData.telefone, formData.email]);

  const handleInputChange = (campo: string, valor: string) => {
    let valorFormatado = valor;

    switch (campo) {
      case 'rg':
        valorFormatado = aplicarMascaraRG(valor.replace(/\D/g, ''));
        break;
      case 'cpf':
        const cpfNumeros = valor.replace(/\D/g, '').slice(0, 11);
        valorFormatado = aplicarMascaraCPF(cpfNumeros);
        break;
      case 'telefone':
        const telefoneNumeros = valor.replace(/\D/g, '').slice(0, 11);
        valorFormatado = aplicarMascaraTelefone(telefoneNumeros);
        break;
      case 'cep':
        valorFormatado = aplicarMascaraCEP(valor.replace(/\D/g, ''));
        break;
      case 'contaDigito':
        valorFormatado = aplicarMascaraConta(valor.replace(/\D/g, ''));
        break;
      default:
        valorFormatado = valor;
        break;
    }

    setFormData(prev => ({
      ...prev,
      [campo]: valorFormatado,
    }));

    if (campo === 'cep' && valorFormatado.length === 8) {
      buscarCEP(valorFormatado);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validação básica
      if (!formData.nome || !formData.email || !formData.cpf) {
        setDialogMessage('Preencha os campos obrigatórios: Nome, Email e CPF');
        setShowErrorDialog(true);
        return;
      }

      // Validação do CPF
      if (formData.cpf.replace(/\D/g, '').length !== 11) {
        setDialogMessage('CPF deve ter exatamente 11 dígitos');
        setShowErrorDialog(true);
        return;
      }

      // Validação do telefone se preenchido
      if (
        formData.telefone &&
        formData.telefone.replace(/\D/g, '').length !== 11
      ) {
        setDialogMessage(
          'Telefone deve ter exatamente 11 dígitos (DDD + 9 dígitos)'
        );
        setShowErrorDialog(true);
        return;
      }

      // Preparar dados para inserção
      const dadosParaInserir = {
        nome: formData.nome,
        nome_mae: formData.nomeMae || null,
        rg: formData.rg || null,
        cpf: formData.cpf,
        numero_beneficio_matricula: formData.numeroBeneficioMatricula || null,
        data_nascimento: formData.dataNascimento || null,
        email: formData.email,
        telefone: formData.telefone || null,
        cep: formData.cep || null,
        endereco: formData.endereco || null,
        numero: formData.numero || null,
        complemento: formData.complemento || null,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
        banco_id: formData.bancoId ? parseInt(formData.bancoId) : null,
        agencia: formData.agencia || null,
        conta_digito: formData.contaDigito || null,
        tipo_conta: formData.tipoConta || 'Corrente',
        tipo_pix: formData.tipoPix || 'CPF',
        chave_pix: formData.chavePix || formData.cpf || formData.email,
        ativo: true,
      };

      // Inserir no banco
      const { data, error } = await supabase
        .from('clientes_pessoa_fisica')
        .insert([dadosParaInserir])
        .select();

      if (error) {
        console.error('Erro ao salvar:', error);
        setDialogMessage(`Erro ao salvar: ${error.message}`);
        setShowErrorDialog(true);
        return;
      }

      if (data && data.length > 0) {
        setDialogMessage('Cliente pessoa física cadastrado com sucesso!');
        setShowSuccessDialog(true);
      } else {
        setDialogMessage('Erro: Nenhum dado foi retornado da inserção');
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error('Erro:', error);
      setDialogMessage('Erro interno do sistema');
      setShowErrorDialog(true);
    }
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
                Cadastro de Cliente - Pessoa Física
              </h1>
              <p className="text-holding-accent-light mt-2">
                Preencha os dados para cadastrar um novo cliente pessoa física
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dados Pessoais */}
              <Card className="glass-effect-accent border-holding-accent/30">
                <CardHeader>
                  <CardTitle className="text-holding-white flex items-center space-x-3">
                    <User className="w-5 h-5 text-holding-highlight" />
                    <span>Dados Pessoais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Nome Completo *</span>
                    </Label>
                    <Input
                      value={formData.nome}
                      onChange={e => handleInputChange('nome', e.target.value)}
                      placeholder="Digite o nome completo"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Nome da Mãe</span>
                    </Label>
                    <Input
                      value={formData.nomeMae}
                      onChange={e =>
                        handleInputChange('nomeMae', e.target.value)
                      }
                      placeholder="Digite o nome da mãe"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>RG</span>
                      </Label>
                      <Input
                        value={formData.rg}
                        onChange={e => handleInputChange('rg', e.target.value)}
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
                        value={formData.cpf}
                        onChange={e => handleInputChange('cpf', e.target.value)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        inputMode="numeric"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Número do Benefício/Matrícula</span>
                    </Label>
                    <Input
                      value={formData.numeroBeneficioMatricula}
                      onChange={e =>
                        handleInputChange(
                          'numeroBeneficioMatricula',
                          e.target.value
                        )
                      }
                      placeholder="Digite o número do benefício ou matrícula"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                    />
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Data de Nascimento</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.dataNascimento}
                      onChange={e =>
                        handleInputChange('dataNascimento', e.target.value)
                      }
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email *</span>
                      </Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={e =>
                          handleInputChange('email', e.target.value)
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
                        value={formData.telefone}
                        onChange={e =>
                          handleInputChange('telefone', e.target.value)
                        }
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        inputMode="numeric"
                      />
                    </div>
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
                    <div className="flex space-x-2">
                      <Input
                        value={formData.cep}
                        onChange={e => handleInputChange('cep', e.target.value)}
                        placeholder="00000-000"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          buscarCEP(formData.cep.replace(/\D/g, ''))
                        }
                        disabled={formData.cep.length < 8}
                        className="mt-1 bg-holding-highlight hover:bg-holding-highlight-light text-holding-white px-3 py-2"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
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
                      placeholder="Digite o endereço completo"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium">
                        Número
                      </Label>
                      <Input
                        value={formData.numero}
                        onChange={e =>
                          handleInputChange('numero', e.target.value)
                        }
                        placeholder="000"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium">
                        Complemento
                      </Label>
                      <Input
                        value={formData.complemento}
                        onChange={e =>
                          handleInputChange('complemento', e.target.value)
                        }
                        placeholder="Apto, Casa, etc."
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium">
                        Bairro
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium">
                        Cidade
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

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium">
                        Estado
                      </Label>
                      <Input
                        value={formData.estado}
                        placeholder="UF"
                        onChange={e =>
                          handleInputChange('estado', e.target.value)
                        }
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dados Bancários */}
              <Card className="glass-effect-accent border-holding-accent/30">
                <CardHeader>
                  <CardTitle className="text-holding-white flex items-center space-x-3">
                    <Building className="w-5 h-5 text-holding-highlight" />
                    <span>Dados Bancários</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Banco</span>
                    </Label>
                    <select
                      value={formData.bancoId}
                      onChange={e =>
                        handleInputChange('bancoId', e.target.value)
                      }
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-holding-accent-light focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecione o banco</option>
                      {bancos.map(banco => (
                        <option key={banco.id} value={banco.id.toString()}>
                          {banco.codigo} - {banco.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <Building className="w-4 h-4" />
                        <span>Agência</span>
                      </Label>
                      <Input
                        value={formData.agencia}
                        onChange={e =>
                          handleInputChange('agencia', e.target.value)
                        }
                        placeholder="0000"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <CreditCardIcon className="w-4 h-4" />
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

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <CreditCardIcon className="w-4 h-4" />
                      <span>Tipo de Conta</span>
                    </Label>
                    <select
                      value={formData.tipoConta}
                      onChange={e =>
                        handleInputChange('tipoConta', e.target.value)
                      }
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-holding-accent-light focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Corrente">Conta Corrente</option>
                      <option value="Poupança">Conta Poupança</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <Key className="w-4 h-4" />
                        <span>Tipo do PIX</span>
                      </Label>
                      <select
                        value={formData.tipoPix}
                        onChange={e =>
                          handleInputChange('tipoPix', e.target.value)
                        }
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-holding-accent-light focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="CPF">CPF</option>
                        <option value="Telefone">Telefone</option>
                        <option value="E-mail">E-mail</option>
                      </select>
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
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botão de Envio */}
            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white px-8 py-3"
              >
                <Save className="w-5 h-5 mr-2" />
                Cadastrar Cliente
              </Button>
            </div>
          </form>

          {/* Popup de Sucesso */}
          <AlertDialog
            open={showSuccessDialog}
            onOpenChange={setShowSuccessDialog}
          >
            <AlertDialogContent className="glass-effect-accent border-holding-accent/30">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-holding-white flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                  <span>Cliente Cadastrado com Sucesso!</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-holding-accent-light">
                  {dialogMessage}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogAction
                  onClick={() => {
                    setShowSuccessDialog(false);
                    setFormData({
                      nome: '',
                      nomeMae: '',
                      rg: '',
                      cpf: '',
                      numeroBeneficioMatricula: '',
                      dataNascimento: '',
                      email: '',
                      telefone: '',
                      cep: '',
                      endereco: '',
                      numero: '',
                      complemento: '',
                      bairro: '',
                      cidade: '',
                      estado: '',
                      bancoId: '',
                      agencia: '',
                      contaDigito: '',
                      tipoConta: 'Corrente',
                      tipoPix: 'CPF',
                      chavePix: '',
                    });
                  }}
                  className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white"
                >
                  Cadastrar Novo Cliente
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={() => {
                    setShowSuccessDialog(false);
                    router.push('/dashboard');
                  }}
                  className="bg-holding-secondary hover:bg-holding-accent/20 text-holding-white border-holding-accent/30"
                >
                  Retornar ao Início
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Popup de Erro */}
          <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
            <AlertDialogContent className="glass-effect-accent border-holding-accent/30">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-holding-white flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                  </div>
                  <span>Erro</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-holding-accent-light">
                  {dialogMessage}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
                  Tentar Novamente
                </AlertDialogAction>
                <AlertDialogCancel onClick={() => setShowErrorDialog(false)}>
                  Cancelar
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
