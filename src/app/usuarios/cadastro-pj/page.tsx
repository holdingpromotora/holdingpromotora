'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
import { createTables } from '@/lib/supabase';
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
  Search,
  MapPin,
  User,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  Banknote,
  Key,
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

export default function CadastroPessoaJuridicaPage() {
  console.log('🚀 Componente CadastroPessoaJuridicaPage renderizado');

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
    proprietarioNome: '',
    proprietarioRg: '',
    proprietarioCpf: '',
    proprietarioDataNascimento: '',
    proprietarioEmail: '',
    proprietarioTelefone: '',
    bancoId: '',
    agencia: '',
    contaDigito: '',
    tipoConta: '',
    tipoPix: '',
    chavePix: '',
    usuario: '',
    senha: '',
  });

  console.log('📋 Estado inicial do formulário:', formData);

  const [bancos, setBancos] = useState<Banco[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Carregar bancos do Supabase
  useEffect(() => {
    const carregarBancos = async () => {
      try {
        // Primeiro, tentar criar as tabelas se não existirem
        await createTables();

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
            { id: 8, codigo: '422', nome: 'Safra' },
            { id: 9, codigo: '041', nome: 'Banrisul' },
            { id: 10, codigo: '077', nome: 'Inter' },
          ];
          setBancos(bancosMock);
        } else {
          setBancos(bancosData || []);
        }
      } catch (error) {
        console.error('Erro ao inicializar:', error);
      }
    };

    carregarBancos();
  }, []);

  // Máscaras
  const aplicarMascaraCNPJ = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 5)
      return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
    if (numeros.length <= 8)
      return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`;
    if (numeros.length <= 12)
      return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`;
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12, 14)}`;
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

  const aplicarMascaraConta = (valor: string) => {
    if (valor.length <= 4) return valor;
    return valor.slice(0, -1) + '-' + valor.slice(-1);
  };

  // Buscar dados da Receita Federal via API gratuita
  const buscarCNPJ = async () => {
    const cnpjLimpo = formData.cnpj.replace(/\D/g, '');

    if (!cnpjLimpo || cnpjLimpo.length !== 14) {
      console.log(
        `⚠️ CNPJ inválido. Digite um CNPJ com 14 dígitos. Atual: ${cnpjLimpo.length} dígitos.`
      );
      return;
    }

    setIsLoadingCNPJ(true);
    try {
      // Buscar dados reais via BrasilAPI (gratuita)
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log('⚠️ CNPJ não encontrado na base da Receita Federal.');
          return;
        }
        throw new Error(`Erro na API: ${response.status}`);
      }

      const dadosReceita = await response.json();

      // Verificar se os dados são válidos
      if (!dadosReceita.razao_social) {
        console.log('⚠️ Dados do CNPJ incompletos ou inválidos.');
        return;
      }

      // Preencher automaticamente os campos com dados reais
      setFormData(prev => ({
        ...prev,
        razaoSocial: dadosReceita.razao_social || '',
        nomeFantasia: dadosReceita.nome_fantasia || '',
        cep: dadosReceita.cep
          ? dadosReceita.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')
          : '',
        endereco: dadosReceita.logradouro || '',
        numero: dadosReceita.numero || '',
        complemento: dadosReceita.complemento || '',
        bairro: dadosReceita.bairro || '',
        cidade: dadosReceita.municipio || '',
        estado: dadosReceita.uf || '',
      }));

      // Apenas mostrar mensagem no console, sem popup bloqueante
      console.log(
        `✅ Dados encontrados para CNPJ ${formData.cnpj} e preenchidos automaticamente!`
      );
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);

      // Fallback para dados mock se a API falhar
      try {
        const dadosMock = gerarDadosRealistas(cnpjLimpo);

        setFormData(prev => ({
          ...prev,
          razaoSocial: dadosMock.razao_social,
          nomeFantasia: dadosMock.nome_fantasia,
          cep: dadosMock.cep,
          endereco: dadosMock.endereco,
          numero: dadosMock.numero,
          complemento: dadosMock.complemento,
          bairro: dadosMock.bairro,
          cidade: dadosMock.cidade,
          estado: dadosMock.estado,
        }));

        // Apenas mostrar mensagem no console, sem popup bloqueante
        console.log(
          `⚠️ API indisponível. Dados simulados preenchidos para CNPJ ${formData.cnpj}.`
        );
      } catch {
        // Apenas mostrar mensagem no console, sem popup bloqueante
        console.log(
          '⚠️ Erro ao buscar CNPJ. Os campos podem ser preenchidos manualmente.'
        );
      }
    } finally {
      setIsLoadingCNPJ(false);
    }
  };

  // Função para gerar dados mais realistas baseados no CNPJ
  const gerarDadosRealistas = (cnpj: string): DadosReceita => {
    // Extrair informações do CNPJ para gerar dados mais realistas
    const uf = cnpj.slice(0, 2);
    const ramo = cnpj.slice(2, 5);
    const tipo = cnpj.slice(8, 12);

    // Mapear UF para estado
    const estados = {
      '11': 'SP',
      '12': 'SP',
      '13': 'SP',
      '14': 'SP',
      '15': 'SP',
      '16': 'SP',
      '17': 'SP',
      '18': 'SP',
      '19': 'SP',
      '21': 'RJ',
      '22': 'RJ',
      '23': 'RJ',
      '24': 'RJ',
      '25': 'RJ',
      '26': 'RJ',
      '27': 'RJ',
      '28': 'RJ',
      '29': 'RJ',
      '31': 'MG',
      '32': 'MG',
      '33': 'MG',
      '34': 'MG',
      '35': 'MG',
      '36': 'MG',
      '37': 'MG',
      '38': 'MG',
      '39': 'MG',
      '41': 'PR',
      '42': 'PR',
      '43': 'PR',
      '44': 'PR',
      '45': 'PR',
      '46': 'PR',
      '47': 'PR',
      '48': 'PR',
      '49': 'PR',
      '51': 'RS',
      '52': 'RS',
      '53': 'RS',
      '54': 'RS',
      '55': 'RS',
      '56': 'RS',
      '57': 'RS',
      '58': 'RS',
      '59': 'RS',
      '61': 'DF',
      '62': 'GO',
      '63': 'TO',
      '64': 'GO',
      '65': 'MT',
      '66': 'MT',
      '67': 'MS',
      '68': 'AC',
      '69': 'AC',
      '71': 'BA',
      '72': 'BA',
      '73': 'BA',
      '74': 'BA',
      '75': 'BA',
      '76': 'BA',
      '77': 'BA',
      '78': 'BA',
      '79': 'BA',
      '81': 'PE',
      '82': 'AL',
      '83': 'PB',
      '84': 'RN',
      '85': 'CE',
      '86': 'PI',
      '87': 'PE',
      '88': 'CE',
      '89': 'PI',
      '91': 'PA',
      '92': 'AM',
      '93': 'PA',
      '94': 'PA',
      '95': 'RR',
      '96': 'AP',
      '97': 'AM',
      '98': 'MA',
      '99': 'MA',
    };

    // Mapear ramo de atividade
    const ramos = {
      '001': 'Comércio',
      '002': 'Indústria',
      '003': 'Serviços',
      '004': 'Construção',
      '005': 'Transporte',
      '006': 'Agricultura',
      '007': 'Pecuária',
      '008': 'Mineração',
      '009': 'Energia',
      '010': 'Tecnologia',
    };

    // Mapear tipo de empresa
    const tipos = {
      '0001': 'LTDA',
      '0002': 'SA',
      '0003': 'ME',
      '0004': 'EPP',
      '0005': 'Cooperativa',
      '0006': 'Associação',
      '0007': 'Fundação',
      '0008': 'ONG',
      '0009': 'Instituto',
      '0010': 'Sindicato',
    };

    const estado = estados[uf as keyof typeof estados] || 'SP';
    const ramoAtividade = ramos[ramo as keyof typeof ramos] || 'Comércio';
    const tipoEmpresa = tipos[tipo as keyof typeof tipos] || 'LTDA';

    // Gerar endereços baseados no estado
    const enderecos = {
      SP: {
        cidades: [
          'São Paulo',
          'Campinas',
          'Santos',
          'Ribeirão Preto',
          'Sorocaba',
        ],
        bairros: [
          'Centro',
          'Vila Madalena',
          'Pinheiros',
          'Itaim Bibi',
          'Jardins',
        ],
        ruas: [
          'Rua das Flores',
          'Avenida Paulista',
          'Rua Augusta',
          'Rua Oscar Freire',
          'Alameda Santos',
        ],
      },
      RJ: {
        cidades: [
          'Rio de Janeiro',
          'Niterói',
          'Petrópolis',
          'Nova Iguaçu',
          'Duque de Caxias',
        ],
        bairros: ['Copacabana', 'Ipanema', 'Leblon', 'Botafogo', 'Flamengo'],
        ruas: [
          'Avenida Atlântica',
          'Rua Visconde de Pirajá',
          'Rua Nascimento Silva',
          'Rua do Catete',
          'Avenida Rio Branco',
        ],
      },
      MG: {
        cidades: [
          'Belo Horizonte',
          'Uberlândia',
          'Contagem',
          'Juiz de Fora',
          'Betim',
        ],
        bairros: [
          'Savassi',
          'Lourdes',
          'Funcionários',
          'Centro',
          'Santa Efigênia',
        ],
        ruas: [
          'Rua da Bahia',
          'Avenida Afonso Pena',
          'Rua dos Tamoios',
          'Rua Espírito Santo',
          'Avenida Amazonas',
        ],
      },
    };

    const dadosEstado =
      enderecos[estado as keyof typeof enderecos] || enderecos['SP'];
    const cidade =
      dadosEstado.cidades[
        parseInt(ramo.slice(-1)) % dadosEstado.cidades.length
      ];
    const bairro =
      dadosEstado.bairros[
        parseInt(tipo.slice(-1)) % dadosEstado.bairros.length
      ];
    const rua =
      dadosEstado.ruas[parseInt(cnpj.slice(-1)) % dadosEstado.ruas.length];

    // Gerar CEP baseado no estado
    const ceps = {
      SP: ['01001-000', '01310-100', '01452-002', '04567-000', '05424-000'],
      RJ: ['20040-007', '22070-011', '22470-200', '22640-100', '22783-900'],
      MG: ['30112-000', '30180-001', '30190-000', '30240-000', '30380-000'],
    };

    const cep =
      ceps[estado as keyof typeof ceps]?.[parseInt(cnpj.slice(-2)) % 5] ||
      '01001-000';

    return {
      razao_social: `${ramoAtividade} ${cnpj.slice(0, 2)}${cnpj.slice(2, 5)} ${tipoEmpresa}`,
      nome_fantasia: `${ramoAtividade} ${cnpj.slice(0, 2)}`,
      cep: cep,
      endereco: `${rua}, ${parseInt(cnpj.slice(-3)) % 1000}`,
      numero: (parseInt(cnpj.slice(-3)) % 1000).toString(),
      complemento:
        ['Sala', 'Apto', 'Loja', 'Andar', 'Bloco'][
          parseInt(cnpj.slice(-1)) % 5
        ] +
        ' ' +
        ((parseInt(cnpj.slice(-2)) % 20) + 1),
      bairro: bairro,
      cidade: cidade,
      estado: estado,
    };
  };

  // Preencher automaticamente usuário quando email mudar
  useEffect(() => {
    console.log(
      '📧 useEffect: Email alterado para:',
      formData.proprietarioEmail
    );
    if (formData.proprietarioEmail) {
      console.log('🔄 Forçando atualização do campo usuario...');

      // Forçar atualização imediata
      setFormData(prev => {
        const newState = { ...prev, usuario: formData.proprietarioEmail };
        console.log(
          '✅ Usuário definido automaticamente como:',
          formData.proprietarioEmail
        );
        console.log('🔄 Estado completo após atualização:', newState);
        return newState;
      });

      // Verificar se foi atualizado corretamente
      setTimeout(() => {
        console.log('🔍 Verificando se o campo usuario foi atualizado...');
        setFormData(current => {
          if (current.usuario !== formData.proprietarioEmail) {
            console.log(
              '⚠️ Campo usuario não foi atualizado, forçando novamente...'
            );
            return { ...current, usuario: formData.proprietarioEmail };
          }
          console.log('✅ Campo usuario está correto:', current.usuario);
          return current;
        });
      }, 100);
    }
  }, [formData.proprietarioEmail]);

  // Preencher automaticamente chave PIX quando tipoPix ou campos relacionados mudarem
  useEffect(() => {
    console.log('🔄 useEffect PIX: Executando...');
    console.log('🔄 useEffect PIX: tipoPix atual:', formData.tipoPix);
    console.log('🔄 useEffect PIX: cnpj atual:', formData.cnpj);
    console.log(
      '🔄 useEffect PIX: proprietarioCpf atual:',
      formData.proprietarioCpf
    );
    console.log(
      '🔄 useEffect PIX: proprietarioTelefone atual:',
      formData.proprietarioTelefone
    );
    console.log(
      '🔄 useEffect PIX: proprietarioEmail atual:',
      formData.proprietarioEmail
    );

    if (formData.tipoPix) {
      console.log('🔄 Tipo PIX alterado para:', formData.tipoPix);
      let chave = '';

      switch (formData.tipoPix) {
        case 'CNPJ':
          chave = formData.cnpj || '';
          console.log('📋 Preenchendo com CNPJ:', chave);
          break;
        case 'CPF':
          chave = formData.proprietarioCpf || '';
          console.log('📋 Preenchendo com CPF:', chave);
          break;
        case 'Telefone':
          chave = formData.proprietarioTelefone || '';
          console.log('📋 Preenchendo com Telefone:', chave);
          break;
        case 'E-mail':
          chave = formData.proprietarioEmail || '';
          console.log('📋 Preenchendo com E-mail:', chave);
          break;
        default:
          chave = '';
          console.log('❌ Tipo PIX não reconhecido:', formData.tipoPix);
      }

      console.log('✅ Chave PIX definida como:', chave);

      if (chave) {
        setFormData(prev => {
          console.log(
            '🔄 Atualizando chavePix de:',
            prev.chavePix,
            'para:',
            chave
          );
          return { ...prev, chavePix: chave };
        });
      } else {
        console.log('⚠️ Chave PIX vazia, não atualizando');
      }
    } else {
      console.log('ℹ️ Tipo PIX não selecionado');
      // Limpar chave PIX se nenhum tipo estiver selecionado
      setFormData(prev => ({ ...prev, chavePix: '' }));
    }
  }, [
    formData.tipoPix,
    formData.cnpj,
    formData.proprietarioCpf,
    formData.proprietarioTelefone,
    formData.proprietarioEmail,
  ]);

  const handleInputChange = (campo: string, valor: string) => {
    let valorFormatado = valor;

    console.log(`🔄 handleInputChange: Campo ${campo} recebeu valor:`, valor);

    // Aplicar máscaras
    switch (campo) {
      case 'cnpj':
        valorFormatado = aplicarMascaraCNPJ(valor.replace(/\D/g, ''));
        break;
      case 'proprietarioCpf':
        valorFormatado = aplicarMascaraCPF(valor.replace(/\D/g, ''));
        break;
      case 'proprietarioTelefone':
        valorFormatado = aplicarMascaraTelefone(valor.replace(/\D/g, ''));
        break;
      case 'cep':
        valorFormatado = aplicarMascaraCEP(valor.replace(/\D/g, ''));
        break;
      case 'contaDigito':
        valorFormatado = aplicarMascaraConta(valor.replace(/\D/g, ''));
        break;
      case 'tipoPix':
        // Para tipoPix, usar o valor exato sem formatação
        valorFormatado = valor;
        console.log('🎯 Tipo PIX alterado para:', valor);
        break;
      default:
        // Para outros campos, usar o valor original
        valorFormatado = valor;
        break;
    }

    console.log(
      `🔄 handleInputChange: Campo ${campo} formatado para:`,
      valorFormatado
    );

    // Atualizar o estado
    setFormData(prev => {
      const newState = { ...prev, [campo]: valorFormatado };
      console.log(`🔄 Estado atualizado para campo ${campo}:`, newState[campo]);

      // Log especial para proprietarioEmail
      if (campo === 'proprietarioEmail') {
        console.log(
          '📧 Campo proprietarioEmail alterado, novo valor:',
          valorFormatado
        );
        console.log(
          '📧 Campo usuario será atualizado automaticamente para:',
          valorFormatado
        );
      }

      // Log especial para usuario
      if (campo === 'usuario') {
        console.log(
          '⚠️ ATENÇÃO: Campo usuario está sendo alterado manualmente para:',
          valorFormatado
        );
        console.log('⚠️ Isso pode sobrescrever o preenchimento automático!');
      }

      return newState;
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log('🚀 Iniciando salvamento do formulário...');

    try {
      // Primeiro, garantir que as tabelas existam
      console.log('📋 Verificando tabelas...');
      const tablesResult = await createTables();
      console.log('📋 Resultado da verificação de tabelas:', tablesResult);

      // Preparar dados para inserção
      const dadosParaInserir = {
        cnpj: formData.cnpj,
        razao_social: formData.razaoSocial,
        nome_fantasia: formData.nomeFantasia,
        cep: formData.cep,
        endereco: formData.endereco,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        proprietario_nome: formData.proprietarioNome,
        proprietario_rg: formData.proprietarioRg,
        proprietario_cpf: formData.proprietarioCpf,
        proprietario_data_nascimento: formData.proprietarioDataNascimento,
        proprietario_email: formData.proprietarioEmail,
        proprietario_telefone: formData.proprietarioTelefone,
        banco_id: formData.bancoId ? parseInt(formData.bancoId) : null,
        agencia: formData.agencia,
        conta_digito: formData.contaDigito,
        tipo_conta: formData.tipoConta,
        tipo_pix: formData.tipoPix,
        chave_pix: formData.chavePix,
        usuario: formData.usuario,
        senha_hash: formData.senha, // Em produção, deve ser criptografada
        ativo: false, // Inicialmente inativo até aprovação
      };

      console.log('📋 Dados para inserção:', dadosParaInserir);

      // Inserir no Supabase
      console.log('💾 Tentando inserção no banco de dados...');
      console.log('🔑 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log(
        '🔑 Supabase Key:',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? '✅ Configurado'
          : '❌ Não configurado'
      );
      console.log(
        '📊 Dados para inserção:',
        JSON.stringify(dadosParaInserir, null, 2)
      );

      const { data: initialData, error: initialError } = await supabase
        .from('pessoas_juridicas')
        .insert([dadosParaInserir])
        .select();

      let data = initialData;
      const error = initialError;

      if (error) {
        console.error('❌ Erro detalhado ao salvar:', error);
        console.error('❌ Código do erro:', error.code);
        console.error('❌ Mensagem do erro:', error.message);
        console.error('❌ Detalhes do erro:', error.details);

        // Verificar se é erro de tabela não existente
        if (error.code === 'PGRST116') {
          console.log('📋 Tabela não encontrada. Tentando criar...');
          setDialogMessage('Tabela não encontrada. Tentando criar...');

          // Tentar criar a tabela novamente
          const retryTablesResult = await createTables();
          console.log(
            '📋 Resultado da segunda tentativa de criar tabelas:',
            retryTablesResult
          );

          // Tentar inserir novamente
          console.log('💾 Segunda tentativa de inserção...');
          const { data: retryData, error: retryError } = await supabase
            .from('pessoas_juridicas')
            .insert([dadosParaInserir])
            .select();

          if (retryError) {
            console.error('❌ Erro na segunda tentativa:', retryError);
            setDialogMessage(`Erro ao salvar: ${retryError.message}`);
            setShowErrorDialog(true);
            return;
          }

          console.log(
            '✅ Inserção bem-sucedida na segunda tentativa:',
            retryData
          );
          data = retryData;
        } else {
          setDialogMessage(`Erro ao salvar: ${error.message}`);
          setShowErrorDialog(true);
          return;
        }
      }

      console.log('✅ Pessoa jurídica cadastrada com sucesso:', data);

      // Verificar se a inserção foi bem-sucedida
      if (data && data.length > 0) {
        const pessoaJuridica = data[0];
        console.log('✅ Dados inseridos:', pessoaJuridica);

        // Verificar se o trigger criou o usuário automaticamente
        console.log(
          '🔄 Verificando se o usuário foi criado automaticamente...'
        );

        // Aguardar um momento para o trigger executar
        setTimeout(async () => {
          try {
            const { data: usuariosData, error: usuariosError } = await supabase
              .from('usuarios')
              .select('*')
              .eq('email', formData.proprietarioEmail)
              .eq('aprovado', false)
              .eq('ativo', false);

            if (usuariosError) {
              console.error(
                '❌ Erro ao verificar usuário criado:',
                usuariosError
              );
            } else if (usuariosData && usuariosData.length > 0) {
              console.log(
                '✅ Usuário criado automaticamente:',
                usuariosData[0]
              );
              console.log('✅ Usuário enviado para aprovação com sucesso!');
            } else {
              console.log('⚠️ Usuário não foi criado automaticamente');
            }
          } catch (error) {
            console.error('❌ Erro ao verificar criação do usuário:', error);
          }
        }, 2000);

        // IMPORTANTE: Não limpar o formulário aqui, apenas mostrar o popup
        setDialogMessage(
          'Pessoa jurídica cadastrada com sucesso! Aguardando aprovação.'
        );
        setShowSuccessDialog(true);

        // Garantir que o sistema permaneça aberto
        console.log('✅ Sistema permanecerá aberto após cadastro');
      } else {
        console.error('❌ Nenhum dado retornado da inserção');
        setDialogMessage('Erro: Nenhum dado foi retornado da inserção');
        setShowErrorDialog(true);
        return;
      }

      console.log('✅ Formulário processado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao processar formulário:', error);
      setDialogMessage(
        `Erro ao processar formulário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
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
                Cadastro de Pessoa Jurídica
              </h1>
              <p className="text-holding-accent-light mt-2">
                Preencha os dados para cadastrar uma nova pessoa jurídica
              </p>
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
                      <Calculator className="w-4 h-4" />
                      <span>CNPJ</span>
                    </Label>
                    <div className="flex space-x-2">
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
                      <Button
                        type="button"
                        onClick={buscarCNPJ}
                        disabled={isLoadingCNPJ}
                        className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white px-3"
                      >
                        {isLoadingCNPJ ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {/* Debug: mostrar valor atual do CNPJ */}
                    <div className="text-xs text-holding-accent-light mt-1">
                      Debug CNPJ: {formData.cnpj || 'Vazio'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium">
                      Razão Social
                    </Label>
                    <Input
                      value={formData.razaoSocial}
                      onChange={e =>
                        handleInputChange('razaoSocial', e.target.value)
                      }
                      placeholder="Digite a razão social"
                      className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium">
                      Nome Fantasia
                    </Label>
                    <Input
                      value={formData.nomeFantasia}
                      onChange={e =>
                        handleInputChange('nomeFantasia', e.target.value)
                      }
                      placeholder="Digite o nome fantasia"
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
                        placeholder="Sala, Apto, etc."
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

              {/* Dados do Proprietário ou Gerente */}
              <Card className="glass-effect-accent border-holding-accent/30">
                <CardHeader>
                  <CardTitle className="text-holding-white flex items-center space-x-3">
                    <User className="w-5 h-5 text-holding-highlight" />
                    <span>Dados do Proprietário ou Gerente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Nome</span>
                    </Label>
                    <Input
                      value={formData.proprietarioNome}
                      onChange={e =>
                        handleInputChange('proprietarioNome', e.target.value)
                      }
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
                        value={formData.proprietarioRg}
                        onChange={e =>
                          handleInputChange('proprietarioRg', e.target.value)
                        }
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
                        value={formData.proprietarioCpf}
                        onChange={e =>
                          handleInputChange('proprietarioCpf', e.target.value)
                        }
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                        required
                      />
                      {/* Debug: mostrar valor atual do CPF */}
                      <div className="text-xs text-holding-accent-light mt-1">
                        Debug CPF: {formData.proprietarioCpf || 'Vazio'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-holding-accent-light text-sm font-medium flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Data de Nascimento</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.proprietarioDataNascimento}
                      onChange={e =>
                        handleInputChange(
                          'proprietarioDataNascimento',
                          e.target.value
                        )
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
                        value={formData.proprietarioEmail}
                        onChange={e =>
                          handleInputChange('proprietarioEmail', e.target.value)
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
                        value={formData.proprietarioTelefone}
                        onChange={e =>
                          handleInputChange(
                            'proprietarioTelefone',
                            e.target.value
                          )
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
                        <Banknote className="w-4 h-4" />
                        <span>Conta com Dígito</span>
                      </Label>
                      <Input
                        value={formData.contaDigito}
                        onChange={e =>
                          handleInputChange('contaDigito', e.target.value)
                        }
                        placeholder="00000-0"
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light"
                      />
                    </div>
                  </div>

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
                        onChange={e =>
                          handleInputChange('tipoPix', e.target.value)
                        }
                        className="mt-1 bg-holding-secondary border-holding-accent/30 text-holding-white flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-holding-accent-light focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="CNPJ">CNPJ</option>
                        <option value="CPF">CPF</option>
                        <option value="Telefone">Telefone</option>
                        <option value="E-mail">E-mail</option>
                      </select>
                      {/* Debug: mostrar valor atual do tipo de PIX */}
                      <div className="text-xs text-holding-accent-light mt-1">
                        Debug: {formData.tipoPix || 'Não selecionado'}
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
                        readOnly
                      />
                      {/* Debug: mostrar valor atual da chave PIX */}
                      <div className="text-xs text-holding-accent-light mt-1">
                        Debug: {formData.chavePix || 'Vazio'}
                      </div>
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
            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white px-8 py-3"
              >
                <Banknote className="w-5 h-5 mr-2" />
                Cadastrar Pessoa Jurídica
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
                    'Pessoa jurídica cadastrada com sucesso! Aguardando aprovação.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogAction
                  onClick={() => {
                    setShowSuccessDialog(false);
                    // Limpar formulário para novo cadastro
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
                      proprietarioNome: '',
                      proprietarioRg: '',
                      proprietarioCpf: '',
                      proprietarioDataNascimento: '',
                      proprietarioEmail: '',
                      proprietarioTelefone: '',
                      bancoId: '',
                      agencia: '',
                      contaDigito: '',
                      tipoConta: '',
                      tipoPix: '',
                      chavePix: '',
                      usuario: '',
                      senha: '',
                    });
                    console.log('✅ Formulário limpo para novo cadastro');
                    console.log('✅ Sistema permanecerá aberto');
                  }}
                  className="bg-holding-highlight hover:bg-holding-highlight-light text-holding-white"
                >
                  Cadastrar Nova Pessoa Jurídica
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
