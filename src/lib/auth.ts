import { createClient } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  is_vip: boolean;
  vip_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export async function signUp(email: string, password: string, name?: string): Promise<User | null> {
  const supabase = createClient();
  
  try {
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (authError) {
      console.error('Erro ao criar conta:', authError.message);
      throw new Error(authError.message);
    }
    
    if (!authData.user) {
      throw new Error('Falha ao criar usuário');
    }

    // Criar registro na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        is_vip: false,
      })
      .select()
      .single();

    if (userError) {
      console.error('Erro ao criar perfil:', userError.message);
      throw new Error('Erro ao criar perfil de usuário');
    }

    return userData;
  } catch (error: any) {
    console.error('Erro no cadastro:', error.message);
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<User | null> {
  const supabase = createClient();
  
  try {
    // Fazer login no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Tratamento específico de erros
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
      }
      
      if (authError.message.includes('Email not confirmed')) {
        throw new Error('Email não confirmado. Verifique sua caixa de entrada e confirme seu email.');
      }
      
      if (authError.message.includes('User not found')) {
        throw new Error('Usuário não encontrado. Cadastre-se primeiro.');
      }

      // Erro genérico
      console.error('Erro de autenticação:', authError.message);
      throw new Error(`Erro ao fazer login: ${authError.message}`);
    }
    
    if (!authData.user) {
      throw new Error('Falha ao fazer login');
    }

    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('Erro ao buscar perfil:', userError.message);
      throw new Error('Erro ao carregar perfil do usuário');
    }

    return userData;
  } catch (error: any) {
    console.error('Erro no login:', error.message);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) throw error;

    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function updateUserVipStatus(userId: string, isVip: boolean, expiresAt?: Date): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('users')
      .update({
        is_vip: isVip,
        vip_expires_at: expiresAt?.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error updating VIP status:', error);
    return false;
  }
}
