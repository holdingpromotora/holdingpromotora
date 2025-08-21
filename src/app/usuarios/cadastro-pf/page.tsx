'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Users,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building,
  Calculator,
  FileText,
  FileSpreadsheet,
  UserPlus,
  User,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Key,
  Save,
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

export default function CadastroPessoaFisicaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    rg: '',
    cpf: '',
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
    tipoConta: 'Corrente', // Valor padrão válido
    tipoPix: 'CPF', // Valor padrão válido
    chavePix: '',
    usuario: '',
    senha: '',
  });

  const [bancos, setBancos] = useState<Banco[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Carregar bancos do Supabase
  useEffect(() => {
    const carregarBancos = async () => {
      try {
        console.log('🔍 Carregando bancos do Supabase...');

        // Carregar bancos da tabela
        const { data: bancosData, error } = await supabase
          .from('bancos')
          .select('*')
          .eq('ativo', true)
          .order('nome');

        if (error) {
          console.error('Erro ao carregar bancos:', error);
          // Fallback para dados mock se houver erro
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
          console.log('✅ Bancos carregados com sucesso:', bancosData);
          setBancos(bancosData);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar bancos:', error);
        // Fallback para dados mock em caso de erro
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

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Máscaras
  const aplicarMascaraRG = (valor: string) => {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  };

  const aplicarMascaraCPF = (valor: string) => {
    // Remove tudo que não é número e limita a EXATAMENTE 11 dígitos
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    // Se não tem números suficientes, retorna como está
    if (numeros.length === 0) return '';

    // Aplica máscara: 000.000.000-00
    if (numeros.length <= 3) {
      return numeros;
    } else if (numeros.length <= 6) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    } else if (numeros.length <= 9) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    } else {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
    }
  };

  const aplicarMascaraTelefone = (valor: string) => {
    // Remove tudo que não é número e limita a EXATAMENTE 11 dígitos
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    // Se não tem números suficientes, retorna como está
    if (numeros.length === 0) return '';

    // Aplica máscara: (00) 00000-0000
    if (numeros.length <= 2) {
      return `(${numeros}`;
    } else if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
  };

  const aplicarMascaraCEP = (valor: string) => {
    return valor.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Função para aplicar máscara na conta com dígito
  const aplicarMascaraConta = (valor: string) => {
    // Remove tudo que não é número
    const numeros = valor.replace(/\D/g, '');

    // Aplica máscara: conta-dígito (sem restrição antes, apenas 1 após)
    if (numeros.length <= 1) {
      return numeros;
    } else {
      // Tudo antes do último número vira conta, último número vira dígito
      const conta = numeros.slice(0, -1);
      const digito = numeros.slice(-1);
      return `${conta}-${digito}`;
    }
  };

  // Função para atualizar conta com dígito com máscara
  const handleContaDigitoChange = (valor: string) => {
    const valorComMascara = aplicarMascaraConta(valor);
    setFormData(prev => ({
      ...prev,
      contaDigito: valorComMascara,
    }));
  };

  // Preencher automaticamente usuário quando email mudar
  useEffect(() => {
    if (formData.email && formData.email !== 'grupoarmandogomes@gmail.com') {
      // IMPORTANTE: Não alterar o usuário master
      console.log('🔄 Preenchendo usuário automaticamente:', formData.email);
      setFormData(prev => ({ ...prev, usuario: formData.email }));
    }
  }, [formData.email]);

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
      if (chave && formData.email !== 'grupoarmandogomes@gmail.com') {
        // IMPORTANTE: Não alterar automaticamente se for usuário master
        setFormData(prev => ({ ...prev, chavePix: chave }));
      }
    }
  }, [formData.tipoPix, formData.cpf, formData.telefone, formData.email]);

  // Função para buscar automaticamente a chave PIX baseada no tipo selecionado
  const buscarChavePixAutomatica = (tipoPix: string) => {
    console.log('🔍 Buscando chave PIX para tipo:', tipoPix);

    // IMPORTANTE: Não alterar automaticamente se for usuário master
    if (formData.email === 'grupoarmandogomes@gmail.com') {
      console.log(
        '🔄 Usuário master detectado, não alterando chave PIX automaticamente'
      );
      return formData.chavePix || '';
    }

    switch (tipoPix) {
      case 'CPF':
        return formData.cpf || '';
      case 'CNPJ':
        return formData.cpf || ''; // Para PF, usa CPF mesmo
      case 'Telefone':
        return formData.telefone || '';
      case 'E-mail':
        return formData.email || '';
      default:
        return formData.email || ''; // Usar email como padrão
    }
  };

  // Função para atualizar tipo PIX e buscar chave automaticamente
  const handleTipoPixChange = (tipoPix: string) => {
    console.log('🔄 Tipo PIX alterado para:', tipoPix);

    setFormData(prev => ({
      ...prev,
      tipoPix,
      chavePix: buscarChavePixAutomatica(tipoPix),
    }));
  };

  const handleInputChange = (campo: string, valor: string) => {
    console.log(`🔄 Campo ${campo} alterado para:`, valor);

    let valorFormatado = valor;

    // Aplicar máscaras apenas para campos específicos
    switch (campo) {
      case 'rg':
        valorFormatado = aplicarMascaraRG(valor.replace(/\D/g, ''));
        break;
      case 'cpf':
        // Para CPF, sempre aplicar máscara e limitar a 11 dígitos
        const cpfNumeros = valor.replace(/\D/g, '').slice(0, 11);
        valorFormatado = aplicarMascaraCPF(cpfNumeros);
        break;
      case 'telefone':
        // Para telefone, sempre aplicar máscara e limitar a 11 dígitos
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
        // Para outros campos, usar o valor original
        valorFormatado = valor;
        break;
    }

    // Validação específica para tipos de conta e PIX
    if (campo === 'tipoConta') {
      const tiposValidos = ['Corrente', 'Poupança'];
      if (!tiposValidos.includes(valor)) {
        console.warn('⚠️ Tipo de conta inválido detectado, usando padrão');
        valorFormatado = 'Corrente';
      }
    }

    if (campo === 'tipoPix') {
      const tiposValidos = ['CPF', 'Telefone', 'E-mail'];
      if (!tiposValidos.includes(valor)) {
        console.warn('⚠️ Tipo PIX inválido detectado, usando padrão');
        valorFormatado = 'CPF';
      }
    }

    setFormData(prev => ({
      ...prev,
      [campo]: valorFormatado,
    }));

    // Buscar CEP automaticamente quando o campo CEP for preenchido
    if (campo === 'cep' && valorFormatado.length === 8) {
      buscarCEP(valorFormatado);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('🚀 Iniciando cadastro...');
    console.log('🚀 FormData recebido:', formData);

    try {
      // Validação básica
      if (
        !formData.nome ||
        !formData.email ||
        !formData.senha ||
        !formData.cpf
      ) {
        console.log('❌ Validação falhou - campos obrigatórios vazios');
        console.log('❌ Nome:', !!formData.nome);
        console.log('❌ Email:', !!formData.email);
        console.log('❌ Senha:', !!formData.senha);
        console.log('❌ CPF:', !!formData.cpf);
        setDialogMessage(
          'Preencha os campos obrigatórios: Nome, Email, Senha e CPF'
        );
        setShowErrorDialog(true);
        return;
      }

      console.log('✅ Validação básica passou');

      // Validação do CPF
      if (formData.cpf.replace(/\D/g, '').length !== 11) {
        console.log(
          '❌ Validação CPF falhou:',
          formData.cpf.replace(/\D/g, '').length,
          'dígitos'
        );
        setDialogMessage('CPF deve ter exatamente 11 dígitos');
        setShowErrorDialog(true);
        return;
      }

      console.log('✅ Validação CPF passou');

      // Validação do telefone se preenchido
      if (
        formData.telefone &&
        formData.telefone.replace(/\D/g, '').length !== 11
      ) {
        console.log(
          '❌ Validação telefone falhou:',
          formData.telefone.replace(/\D/g, '').length,
          'dígitos'
        );
        setDialogMessage(
          'Telefone deve ter exatamente 11 dígitos (DDD + 9 dígitos)'
        );
        setShowErrorDialog(true);
        return;
      }

      console.log('✅ Validação telefone passou');

      // Preparar dados para inserção (igual ao teste que funcionou)
      const dadosParaInserir = {
        nome: formData.nome,
        cpf: formData.cpf,
        email: formData.email,
        usuario: formData.usuario || formData.email,
        senha_hash: formData.senha,
        ativo: false,
        tipo_conta: formData.tipoConta || 'Corrente',
        tipo_pix: formData.tipoPix || 'CPF',
        chave_pix: formData.chavePix || formData.cpf || formData.email,
      };

      console.log('📋 Dados para inserção:', dadosParaInserir);
      console.log('🔍 Verificando Supabase client...');
      console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log(
        '🔍 Supabase Key configurada:',
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      // Testar conexão primeiro
      console.log('🔍 Testando conexão com banco...');
      const { error: testError } = await supabase
        .from('bancos')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('❌ Erro na conexão:', testError);
        setDialogMessage('Erro de conexão com banco de dados');
        setShowErrorDialog(true);
        return;
      }

      console.log('✅ Conexão com banco OK');

      // Inserir no banco (igual ao teste que funcionou)
      console.log('🔍 Tentando inserir no banco...');
      const { data, error } = await supabase
        .from('pessoas_fisicas')
        .insert([dadosParaInserir])
        .select();

      console.log('🔍 Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ Erro ao salvar:', error);
        console.error('❌ Código do erro:', error.code);
        console.error('❌ Mensagem do erro:', error.message);
        setDialogMessage(`Erro ao salvar: ${error.message}`);
        setShowErrorDialog(true);
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ Dados inseridos com sucesso:', data);
        setDialogMessage(
          'Pessoa física cadastrada com sucesso! Aguardando aprovação.'
        );
        setShowSuccessDialog(true);
      } else {
        console.error('❌ Nenhum dado retornado da inserção');
        setDialogMessage('Erro: Nenhum dado foi retornado da inserção');
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error('❌ Erro geral:', error);
      setDialogMessage('Erro interno do sistema');
      setShowErrorDialog(true);
    }
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
            } h-12 p-0 text-holding-white hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg bg-holding-blue-light/20`}
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
            } h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg`}
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
                Cadastro de Pessoa Física
              </h1>
              <p className="text-holding-accent-light mt-2">
                Preencha os dados para cadastrar uma nova pessoa física
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
                      <span>Nome Completo</span>
                    </Label>
                    <Input
                      value={formData.nome}
                      onChange={e => handleInputChange('nome', e.target.value)}
                      placeholder="Digite o nome completo"
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
                        value={formData.rg}
                        onChange={e => handleInputChange('rg', e.target.value)}
                        placeholder="00.000.000-0"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>

                    <div>
                      <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>CPF</span>
                      </Label>
                      <Input
                        value={formData.cpf}
                        onChange={e => handleInputChange('cpf', e.target.value)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        inputMode="numeric"
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
                        <span>Email</span>
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
                        Buscar
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
                        <CreditCard className="w-4 h-4" />
                        <span>Conta com Dígito</span>
                      </Label>
                      <Input
                        value={formData.contaDigito}
                        onChange={e => handleContaDigitoChange(e.target.value)}
                        placeholder="Conta-Dígito (ex: 12345-6)"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Tipo de Conta</span>
                    </Label>
                    <select
                      value={formData.tipoConta}
                      onChange={e => {
                        console.log(
                          '🔄 Tipo de conta selecionado:',
                          e.target.value
                        );
                        handleInputChange('tipoConta', e.target.value);
                      }}
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-holding-accent-light focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecione o tipo de conta</option>
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
                        onChange={e => {
                          console.log(
                            '🔄 Tipo PIX selecionado:',
                            e.target.value
                          );
                          handleTipoPixChange(e.target.value);
                        }}
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-holding-accent-light focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione o tipo</option>
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

              {/* Dados de Acesso */}
              <Card className="glass-effect-accent border-holding-accent/30">
                <CardHeader>
                  <CardTitle className="text-holding-white flex items-center space-x-3">
                    <Key className="w-5 h-5 text-holding-highlight" />
                    <span>Dados de Acesso</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Usuário</span>
                    </Label>
                    <Input
                      value={formData.usuario}
                      onChange={e =>
                        handleInputChange('usuario', e.target.value)
                      }
                      placeholder="Email será usado como usuário"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <Key className="w-4 h-4" />
                      <span>Senha</span>
                    </Label>
                    <Input
                      type="password"
                      value={formData.senha}
                      onChange={e => handleInputChange('senha', e.target.value)}
                      placeholder="Digite a senha"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botão de Envio */}
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                type="submit"
                className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white px-8 py-3"
              >
                <Save className="w-5 h-5 mr-2" />
                Cadastrar Pessoa Física
              </Button>

              {/* Botão de teste para debug */}
              <Button
                type="button"
                onClick={() => {
                  console.log('🔍 TESTE: Botão de teste clicado');
                  console.log('🔍 FormData atual:', formData);
                  console.log(
                    '🔍 Função handleSubmit existe:',
                    typeof handleSubmit
                  );

                  // Preencher formulário com dados de teste
                  console.log(
                    '🔍 TESTE: Preenchendo formulário com dados de teste...'
                  );
                  setFormData({
                    nome: 'João Silva Teste',
                    rg: '12.345.678-9',
                    cpf: '12345678901',
                    dataNascimento: '1990-01-01',
                    email: 'joao.teste@exemplo.com',
                    telefone: '11987654321',
                    cep: '01234-567',
                    endereco: 'Rua Teste',
                    numero: '123',
                    complemento: 'Apto 1',
                    bairro: 'Centro',
                    cidade: 'São Paulo',
                    estado: 'SP',
                    bancoId: '1',
                    agencia: '1234',
                    contaDigito: '12345-6',
                    tipoConta: 'Corrente',
                    tipoPix: 'CPF',
                    chavePix: '12345678901',
                    usuario: 'joao.teste@exemplo.com',
                    senha: '123456',
                  });

                  console.log(
                    '🔍 TESTE: Formulário preenchido, aguardando 1 segundo...'
                  );

                  // Aguardar um pouco para o estado ser atualizado
                  setTimeout(() => {
                    console.log('🔍 TESTE: Simulando envio do formulário...');
                    const event = {
                      preventDefault: () =>
                        console.log('🔍 preventDefault chamado'),
                    } as React.FormEvent<HTMLFormElement>;

                    handleSubmit(event);
                  }, 1000);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3"
              >
                🧪 Teste Completo
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
                  <span>Cadastro Realizado com Sucesso!</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-holding-accent-light">
                  {dialogMessage ||
                    'Pessoa física cadastrada com sucesso! Aguardando aprovação.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogAction
                  onClick={() => {
                    setShowSuccessDialog(false);
                    // Limpar formulário para novo cadastro
                    setFormData({
                      nome: '',
                      email: '',
                      senha: '',
                      cpf: '',
                      rg: '',
                      dataNascimento: '',
                      cep: '',
                      endereco: '',
                      numero: '',
                      complemento: '',
                      bairro: '',
                      cidade: '',
                      estado: '',
                      telefone: '',
                      bancoId: '',
                      agencia: '',
                      contaDigito: '',
                      tipoConta: '',
                      tipoPix: '',
                      chavePix: '',
                      usuario: '',
                    });
                    console.log('✅ Formulário limpo para novo cadastro');
                    console.log('✅ Sistema permanecerá aberto');
                  }}
                  className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white"
                >
                  Cadastrar Nova Pessoa Física
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={() => {
                    setShowSuccessDialog(false);
                    // Redirecionar para o início do sistema (dashboard) sem fechar
                    console.log(
                      '✅ Redirecionando para dashboard sem fechar sistema'
                    );
                    if (typeof window !== 'undefined') {
                      // Usar router.push em vez de window.location para não recarregar a página
                      router.push('/dashboard');
                    }
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
