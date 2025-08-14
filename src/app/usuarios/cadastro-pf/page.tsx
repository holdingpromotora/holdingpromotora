'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    tipoConta: 'corrente', // Valor padrão válido
    tipoPix: 'cpf', // Valor padrão válido
    chavePix: '',
    usuario: '',
    senha: '',
  });

  const [bancos, setBancos] = useState<Banco[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

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
          console.log(
            '✅ Bancos carregados com sucesso:',
            bancosData?.length || 0
          );
          setBancos(bancosData || []);
        }
      } catch (error) {
        console.error('Erro ao carregar bancos:', error);
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

  // Máscaras
  const aplicarMascaraRG = (valor: string) => {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  };

  const aplicarMascaraCPF = (valor: string) => {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const aplicarMascaraTelefone = (valor: string) => {
    return valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const aplicarMascaraCEP = (valor: string) => {
    return valor.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Função para aplicar máscara na conta com dígito
  const aplicarMascaraConta = (valor: string) => {
    // Remove tudo que não é número
    const numeros = valor.replace(/\D/g, '');

    // Aplica máscara: 00000-0
    if (numeros.length <= 5) {
      return numeros;
    } else {
      return `${numeros.slice(0, 5)}-${numeros.slice(5, 6)}`;
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
    if (formData.email) {
      setFormData(prev => ({ ...prev, usuario: formData.email }));
    }
  }, [formData.email]);

  // Preencher automaticamente chave PIX
  useEffect(() => {
    if (formData.tipoPix) {
      let chave = '';
      switch (formData.tipoPix) {
        case 'CPF':
          chave = formData.cpf;
          break;
        case 'Telefone':
          chave = formData.telefone;
          break;
        case 'E-mail':
          chave = formData.email;
          break;
        default:
          chave = '';
      }
      setFormData(prev => ({ ...prev, chavePix: chave }));
    }
  }, [formData.tipoPix, formData.cpf, formData.telefone, formData.email]);

  // Função para buscar automaticamente a chave PIX baseada no tipo selecionado
  const buscarChavePixAutomatica = (tipoPix: string) => {
    console.log('🔍 Buscando chave PIX para tipo:', tipoPix);

    switch (tipoPix) {
      case 'cpf':
        return formData.cpf || '';
      case 'cnpj':
        return formData.cpf || ''; // Para PF, usa CPF mesmo
      case 'telefone':
        return formData.telefone || '';
      case 'email':
        return formData.email || '';
      default:
        return '';
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

    // Aplicar máscaras
    switch (campo) {
      case 'rg':
        valorFormatado = aplicarMascaraRG(valor.replace(/\D/g, ''));
        break;
      case 'cpf':
        valorFormatado = aplicarMascaraCPF(valor.replace(/\D/g, ''));
        break;
      case 'telefone':
        valorFormatado = aplicarMascaraTelefone(valor.replace(/\D/g, ''));
        break;
      case 'cep':
        valorFormatado = aplicarMascaraCEP(valor.replace(/\D/g, ''));
        break;
      case 'contaDigito':
        valorFormatado = aplicarMascaraConta(valor.replace(/\D/g, ''));
        break;
    }

    // Validação específica para tipos de conta e PIX
    if (campo === 'tipoConta') {
      const tiposValidos = ['corrente', 'poupanca'];
      if (!tiposValidos.includes(valor)) {
        console.warn('⚠️ Tipo de conta inválido detectado, usando padrão');
        valorFormatado = 'corrente';
      }
    }

    if (campo === 'tipoPix') {
      const tiposValidos = ['cpf', 'telefone', 'email'];
      if (!tiposValidos.includes(valor)) {
        console.warn('⚠️ Tipo PIX inválido detectado, usando padrão');
        valorFormatado = 'cpf';
      }
    }

    setFormData(prev => ({
      ...prev,
      [campo]: valorFormatado,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('🔍 Iniciando validação dos dados...');

      // Validação dos campos obrigatórios
      if (!formData.nome || !formData.email) {
        setDialogMessage('Nome e email são obrigatórios.');
        setShowErrorDialog(true);
        return;
      }

      // Validação dos tipos de conta e PIX
      const tiposContaValidos = ['corrente', 'poupanca'];
      const tiposPixValidos = ['cpf', 'telefone', 'email'];

      const tipoContaValido = tiposContaValidos.includes(formData.tipoConta);
      const tipoPixValido = tiposPixValidos.includes(formData.tipoPix);

      console.log(
        '🔍 Tipo de conta:',
        formData.tipoConta,
        'Válido:',
        tipoContaValido
      );
      console.log(
        '🔍 Tipo de PIX:',
        formData.tipoPix,
        'Válido:',
        tipoPixValido
      );

      if (!tipoContaValido) {
        setDialogMessage(
          'Tipo de conta inválido. Use apenas: Corrente ou Poupança.'
        );
        setShowErrorDialog(true);
        return;
      }

      if (!tipoPixValido) {
        setDialogMessage(
          'Tipo de PIX inválido. Use apenas: CPF, Telefone ou E-mail.'
        );
        setShowErrorDialog(true);
        return;
      }

      // Buscar chave PIX automaticamente se não estiver preenchida
      let chavePixFinal = formData.chavePix;
      if (!chavePixFinal) {
        chavePixFinal = buscarChavePixAutomatica(formData.tipoPix);
        console.log('🔍 Chave PIX buscada automaticamente:', chavePixFinal);
      }

      const dadosParaInserir = {
        nome: formData.nome,
        rg: formData.rg || null,
        cpf: formData.cpf || null,
        data_nascimento: formData.dataNascimento || null,
        email: formData.email,
        telefone: formData.telefone,
        cep: formData.cep,
        endereco: formData.endereco,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        banco_id: formData.bancoId ? parseInt(formData.bancoId) : null,
        agencia: formData.agencia,
        conta_digito: formData.contaDigito,
        tipo_conta: formData.tipoConta,
        tipo_pix: formData.tipoPix,
        chave_pix: chavePixFinal,
        usuario: formData.usuario,
        senha_hash: formData.senha, // Em produção, deve ser criptografada
        ativo: true,
      };

      console.log('🔍 Dados para inserção:', dadosParaInserir);

      // Inserir no Supabase
      const { data, error } = await supabase
        .from('pessoas_fisicas')
        .insert([dadosParaInserir])
        .select();

      if (error) {
        console.error('Erro ao salvar:', error);
        setDialogMessage('Erro ao salvar dados. Tente novamente.');
        setShowErrorDialog(true);
      } else {
        console.log('Pessoa física cadastrada com sucesso:', data);
        setShowSuccessDialog(true);

        // Limpar formulário
        setFormData({
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
          tipoConta: 'corrente', // Manter valor padrão válido
          tipoPix: 'cpf', // Manter valor padrão válido
          chavePix: '',
          usuario: '',
          senha: '',
        });
      }
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      setDialogMessage('Erro ao processar formulário. Tente novamente.');
      setShowErrorDialog(true);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
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
                      maxLength={12}
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
                    value={formData.dataNascimento}
                    onChange={e =>
                      handleInputChange('dataNascimento', e.target.value)
                    }
                    className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white"
                    required
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
                      onChange={e => handleInputChange('email', e.target.value)}
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
                      required
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
                      onChange={e =>
                        handleInputChange('estado', e.target.value)
                      }
                      placeholder="UF"
                      maxLength={2}
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
                  <Select
                    value={formData.bancoId}
                    onValueChange={valor => handleInputChange('bancoId', valor)}
                  >
                    <SelectTrigger className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white">
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent className="bg-holding-secondary border-holding-accent/30">
                      {bancos.map(banco => (
                        <SelectItem key={banco.id} value={banco.id.toString()}>
                          {banco.codigo} - {banco.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      onChange={e => handleContaDigitoChange(e.target.value)}
                      placeholder="00000-0"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                    <CreditCardIcon className="w-4 h-4" />
                    <span>Tipo de Conta</span>
                  </Label>
                  <Select
                    value={formData.tipoConta}
                    onValueChange={valor => {
                      console.log('🔄 Tipo de conta selecionado:', valor);
                      handleInputChange('tipoConta', valor);
                    }}
                  >
                    <SelectTrigger className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white">
                      <SelectValue placeholder="Selecione o tipo de conta" />
                    </SelectTrigger>
                    <SelectContent className="bg-holding-secondary border-holding-accent/30">
                      <SelectItem value="corrente">Corrente</SelectItem>
                      <SelectItem value="poupanca">Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <Key className="w-4 h-4" />
                      <span>Tipo do PIX</span>
                    </Label>
                    <Select
                      value={formData.tipoPix}
                      onValueChange={valor => {
                        console.log('🔄 Tipo PIX selecionado:', valor);
                        handleTipoPixChange(valor);
                      }}
                    >
                      <SelectTrigger className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-holding-secondary border-holding-accent/30">
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                      </SelectContent>
                    </Select>
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
                    onChange={e => handleInputChange('usuario', e.target.value)}
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
          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white px-8 py-3"
            >
              <Save className="w-5 h-5 mr-2" />
              Cadastrar Pessoa Física
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
                <span>Sucesso!</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-holding-accent-light">
                Cadastro realizado com sucesso! A pessoa física foi salva no
                banco de dados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
                Continuar
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
    </Layout>
  );
}
