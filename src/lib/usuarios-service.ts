import { supabase } from './supabase';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil_id?: number;
  perfil_nome?: string;
  aprovado?: boolean;
  ativo?: boolean;
  status?: 'pendente' | 'aprovado' | 'rejeitado' | 'ativo' | 'inativo';
  data_cadastro?: string;
  data_aprovacao?: string;
  aprovado_por?: string;
  ultimo_acesso?: string;
  nivel_acesso?: string;
}

export interface FiltroUsuarios {
  searchTerm?: string;
  status?: string;
  perfil?: string;
  aprovado?: boolean;
  ativo?: boolean;
}

// Funções auxiliares para mapear dados do banco
function getPerfilNome(perfilId?: number): string {
  if (!perfilId) return 'Usuário';

  switch (perfilId) {
    case 1:
      return 'Master';
    case 2:
      return 'Submaster';
    case 3:
      return 'Parceiro';
    case 4:
      return 'Colaborador';
    case 5:
      return 'Operador';
    case 6:
      return 'Visualizador';
    case 7:
      return 'Convidado';
    default:
      return 'Usuário';
  }
}

function getStatusFromBanco(aprovado?: boolean, ativo?: boolean): string {
  if (aprovado === undefined || ativo === undefined) return 'pendente';
  if (!aprovado) return 'pendente';
  if (aprovado && ativo) return 'aprovado';
  if (aprovado && !ativo) return 'inativo';
  return 'pendente';
}

export class UsuariosService {
  // Buscar todos os usuários com filtros
  static async buscarUsuarios(
    filtros: FiltroUsuarios = {}
  ): Promise<Usuario[]> {
    try {
      let query = supabase
        .from('usuarios')
        .select(
          `
          id,
          nome,
          email,
          perfil_id,
          aprovado,
          ativo,
          data_cadastro,
          data_aprovacao,
          aprovado_por,
          ultimo_acesso
        `
        )
        .order('nome', { ascending: true });

      // Aplicar filtros
      if (filtros.aprovado !== undefined) {
        query = query.eq('aprovado', filtros.aprovado);
      }

      if (filtros.ativo !== undefined) {
        query = query.eq('ativo', filtros.ativo);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      let usuarios = data || [];

      // Aplicar filtro de busca
      if (filtros.searchTerm) {
        const termo = filtros.searchTerm.toLowerCase();
        usuarios = usuarios.filter(
          usuario =>
            usuario.nome.toLowerCase().includes(termo) ||
            usuario.email.toLowerCase().includes(termo)
        );
      }

      // Mapear dados do banco para a interface esperada
      usuarios = usuarios.map(usuario => ({
        ...usuario,
        perfil_nome: getPerfilNome(usuario.perfil_id),
        status: getStatusFromBanco(usuario.aprovado, usuario.ativo),
      }));

      // Aplicar filtro de status
      if (filtros.status && filtros.status !== 'todos') {
        usuarios = usuarios.filter(
          usuario =>
            getStatusFromBanco(usuario.aprovado, usuario.ativo) ===
            filtros.status
        );
      }

      return usuarios as Usuario[];
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  static async buscarUsuarioPorId(id: number): Promise<Usuario | null> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(
          `
          id,
          nome,
          email,
          perfil_id,
          aprovado,
          ativo,
          data_cadastro,
          data_aprovacao,
          aprovado_por,
          ultimo_acesso
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar usuário:', error);
        throw error;
      }

      if (data) {
        // Mapear dados do banco para a interface esperada
        return {
          ...data,
          perfil_nome: getPerfilNome(data.perfil_id),
          status: getStatusFromBanco(data.aprovado, data.ativo),
        } as Usuario;
      }

      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  // Criar novo usuário
  static async criarUsuario(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    try {
      // Preparar dados para inserção
      const dadosParaInserir = {
        nome: usuario.nome,
        email: usuario.email,
        perfil_id: usuario.perfil_id,
        aprovado: usuario.aprovado,
        ativo: usuario.ativo,
        data_cadastro: usuario.data_cadastro,
        data_aprovacao: usuario.data_aprovacao,
        aprovado_por: usuario.aprovado_por,
        ultimo_acesso: usuario.ultimo_acesso,
      };

      const { data, error } = await supabase
        .from('usuarios')
        .insert([dadosParaInserir])
        .select(
          `
          id,
          nome,
          email,
          perfil_id,
          aprovado,
          ativo,
          data_cadastro,
          data_aprovacao,
          aprovado_por,
          ultimo_acesso
        `
        )
        .single();

      if (error) {
        console.error('❌ Erro ao criar usuário:', error);
        throw error;
      }

      console.log('✅ Usuário criado com sucesso:', data);
      return data as Usuario;
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Atualizar usuário
  static async atualizarUsuario(
    id: number,
    dados: Partial<Usuario>
  ): Promise<Usuario> {
    try {
      // Preparar dados para atualização
      const dadosParaAtualizar = {
        ...dados,
        status:
          dados.status ||
          (dados.aprovado !== undefined || dados.ativo !== undefined
            ? getStatusFromBanco(dados.aprovado, dados.ativo)
            : undefined),
        perfil_nome:
          dados.perfil_nome ||
          (dados.perfil_id !== undefined
            ? getPerfilNome(dados.perfil_id)
            : undefined),
      };

      const { data, error } = await supabase
        .from('usuarios')
        .update(dadosParaAtualizar)
        .eq('id', id)
        .select(
          `
          id,
          nome,
          email,
          perfil_id,
          perfil_nome,
          aprovado,
          ativo,
          status,
          data_cadastro,
          data_aprovacao,
          aprovado_por,
          ultimo_acesso
        `
        )
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar usuário:', error);
        throw error;
      }

      console.log('✅ Usuário atualizado com sucesso:', data);
      return data as Usuario;
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Excluir usuário
  static async excluirUsuario(id: number): Promise<void> {
    try {
      const { error } = await supabase.from('usuarios').delete().eq('id', id);

      if (error) {
        console.error('❌ Erro ao excluir usuário:', error);
        throw error;
      }

      console.log('✅ Usuário excluído com sucesso');
    } catch (error) {
      console.error('❌ Erro ao excluir usuário:', error);
      throw error;
    }
  }

  // Aprovar usuário
  static async aprovarUsuario(
    id: number,
    aprovadoPor: string
  ): Promise<Usuario> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          aprovado: true,
          status: 'aprovado',
          data_aprovacao: new Date().toISOString(),
          aprovado_por: aprovadoPor,
        })
        .eq('id', id)
        .select(
          `
          id,
          nome,
          email,
          perfil_id,
          perfil_nome,
          aprovado,
          ativo,
          status,
          data_cadastro,
          data_aprovacao,
          aprovado_por,
          ultimo_acesso
        `
        )
        .single();

      if (error) {
        console.error('❌ Erro ao aprovar usuário:', error);
        throw error;
      }

      console.log('✅ Usuário aprovado com sucesso:', data);
      return data as Usuario;
    } catch (error) {
      console.error('❌ Erro ao aprovar usuário:', error);
      throw error;
    }
  }

  // Rejeitar usuário
  static async rejeitarUsuario(
    id: number,
    rejeitadoPor: string,
    motivo?: string
  ): Promise<Usuario> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          aprovado: false,
          status: 'rejeitado',
          data_aprovacao: null,
          aprovado_por: null,
        })
        .eq('id', id)
        .select(
          `
          id,
          nome,
          email,
          perfil_id,
          perfil_nome,
          aprovado,
          ativo,
          status,
          data_cadastro,
          data_aprovacao,
          aprovado_por,
          ultimo_acesso
        `
        )
        .single();

      if (error) {
        console.error('❌ Erro ao rejeitar usuário:', error);
        throw error;
      }

      console.log('✅ Usuário rejeitado com sucesso:', data);
      return data as Usuario;
    } catch (error) {
      console.error('❌ Erro ao rejeitar usuário:', error);
      throw error;
    }
  }

  // Buscar estatísticas dos usuários
  static async buscarEstatisticas(): Promise<{
    total: number;
    aprovados: number;
    pendentes: number;
    rejeitados: number;
    ativos: number;
    inativos: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('aprovado, ativo');

      if (error) {
        throw error;
      }

      const usuarios = data || [];

      const estatisticas = {
        total: usuarios.length,
        aprovados: usuarios.filter(u => u.aprovado).length,
        pendentes: usuarios.filter(u => !u.aprovado).length,
        rejeitados: 0, // Não há coluna de rejeição, sempre 0
        ativos: usuarios.filter(u => u.ativo).length,
        inativos: usuarios.filter(u => !u.ativo).length,
      };

      return estatisticas;
    } catch (error) {
      throw error;
    }
  }
}
