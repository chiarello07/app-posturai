import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// INTERFACES
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  has_analysis?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OnboardingData {
  user_id: string;
  name: string;
  birth_date: string;
  phone: string;
  nationality?: string;
  instagram?: string;
  gender?: string;
  height: number;
  weight: number;
  occupation: string;
  work_hours: number;
  work_position: string;
  drinks: string;
  drink_frequency?: string;
  smoker: string;
  cigarettes_per_day?: number;
  sleep_hours: string;
  family_diseases?: string;
  family_diseases_details?: string;
  surgery?: string;
  surgery_details?: string;
  heart_problems?: string;
  heart_problems_details?: string;
  injuries?: string;
  injury_details?: string;
  pain_areas?: string[];
  meals_per_day: string;
  supplements: string;
  supplements_details?: string;
  nutrition_plan: string;
  main_goals: string[];
  favorite_activity: string;
  training_time: string;
  exercise_frequency: string;
  experience_level: string;
  dedication_hours: number;
  completed: boolean;
}

// ============================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================================================

/**
 * Cria usuário no auth.users + registro básico em profiles
 */
export async function signUpUser(email: string, password: string, name?: string) {
  try {
    console.log("📝 Criando conta para:", email);

    // 1. Criar usuário no Supabase Auth (o trigger cria o perfil automaticamente)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0], // Salva o nome nos metadados
        },
      },
    });

    if (error) {
      console.error("❌ Erro ao criar conta:", error);
      return { success: false, error, data: null };
    }

    if (!data.user) {
      console.error("❌ Usuário não foi criado");
      return { 
        success: false, 
        error: { message: "Erro ao criar usuário" }, 
        data: null 
      };
    }

    console.log("✅ Conta criada com sucesso! userId:", data.user.id);
    console.log("✅ Perfil será criado automaticamente pelo trigger");

    // O trigger já criou o perfil automaticamente, não precisa fazer nada!

    return { success: true, data: data.user, error: null };
  } catch (err: any) {
    console.error("❌ Erro inesperado ao criar conta:", err);
    return { 
      success: false, 
      error: { message: err.message || "Erro inesperado" }, 
      data: null 
    };
  }
}

/**
 * Login de usuário
 */
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    return { success: false, error };
  }

  return { success: true, data: data.user };
}

/**
 * Logout de usuário
 */
export async function logoutUser() {
  return await supabase.auth.signOut();
}

/**
 * Obter usuário atual
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return user;
}

// ============================================================================
// FUNÇÕES DE ONBOARDING
// ============================================================================

/**
 * Salvar dados completos do onboarding
 */
export async function saveOnboarding(data: Partial<OnboardingData>) {
  const { data: onboardingData, error } = await supabase
    .from('onboarding')
    .upsert({
      ...data,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  if (error) {
    return { success: false, error };
  }

  // Atualizar nome em profiles
  if (data.name) {
    await supabase
      .from('profiles')
      .update({
        name: data.name,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.user_id);
  }

  return { success: true, data: onboardingData };
}

/**
 * Obter dados do onboarding
 */
export async function getOnboarding(userId: string) {
  const { data, error } = await supabase
    .from('onboarding')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Verificar se onboarding está completo
 */
export async function isOnboardingComplete(userId: string) {
  const { data, error } = await supabase
    .from('onboarding')
    .select('completed')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  return data.completed === true;
}

// ============================================================================
// FUNÇÕES DE UPLOAD DE FOTOS
// ============================================================================

/**
 * Upload de foto para o Storage
 */
export async function uploadPhoto(
  userId: string,
  file: File,
  photoType: 'frontal' | 'lateral-esquerdo' | 'lateral-direito' | 'costas'
) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${photoType}.${fileExt}`;

  // Upload do arquivo
  const { data, error } = await supabase.storage
    .from('postural-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true // Sobrescreve se já existir
    });

  if (error) {
    return { success: false, error };
  }

  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('postural-photos')
    .getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}

/**
 * Upload de todas as 4 fotos
 */
export async function uploadAllPhotos(
  userId: string,
  photos: {
    frontal: File;
    lateralEsquerdo: File;
    lateralDireito: File;
    costas: File;
  }
) {
  const results = {
    frontal: '',
    lateralEsquerdo: '',
    lateralDireito: '',
    costas: ''
  };

  // Upload frontal
  const frontalResult = await uploadPhoto(userId, photos.frontal, 'frontal');
  if (!frontalResult.success) {
    return { success: false, error: frontalResult.error };
  }
  results.frontal = frontalResult.url!;

  // Upload lateral esquerdo
  const lateralEsqResult = await uploadPhoto(userId, photos.lateralEsquerdo, 'lateral-esquerdo');
  if (!lateralEsqResult.success) {
    return { success: false, error: lateralEsqResult.error };
  }
  results.lateralEsquerdo = lateralEsqResult.url!;

  // Upload lateral direito
  const lateralDirResult = await uploadPhoto(userId, photos.lateralDireito, 'lateral-direito');
  if (!lateralDirResult.success) {
    return { success: false, error: lateralDirResult.error };
  }
  results.lateralDireito = lateralDirResult.url!;

  // Upload costas
  const costasResult = await uploadPhoto(userId, photos.costas, 'costas');
  if (!costasResult.success) {
    return { success: false, error: costasResult.error };
  }
  results.costas = costasResult.url!;

  return { success: true, urls: results };
}

// ============================================================================
// FUNÇÕES DE ANÁLISE
// ============================================================================

/**
 * Salvar análise postural
 */
export async function saveAnalysis(userId: string, analysisData: any) {
  const { data, error } = await supabase
    .from('analyses')
    .insert({
      user_id: userId,
      analysis_data: analysisData
    })
    .select()
    .single();

  if (!error) {
    // Marcar que usuário tem análise
    await supabase
      .from('profiles')
      .update({ has_analysis: true })
      .eq('id', userId);
  }

  return { data, error };
}

/**
 * Obter última análise
 */
export async function getLatestAnalysis(userId: string) {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
}

// ============================================================================
// FUNÇÕES DE PROFILE
// ============================================================================

/**
 * Obter perfil do usuário
 */
export async function getProfile(userId: string) {
  console.log("🔍 [getProfile] Buscando perfil para userId:", userId);
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  console.log("🔍 [getProfile] Resultado Supabase:", { data, error });

  if (error) {
    console.error("❌ [getProfile] Erro ao buscar perfil:", error);
    return { 
      success: false, 
      data: null, 
      error 
    };
  }

  if (!data) {
    console.warn("⚠️ [getProfile] Perfil não encontrado (data é null)");
    return { 
      success: false, 
      data: null, 
      error: new Error("Perfil não encontrado") 
    };
  }

  console.log("✅ [getProfile] Perfil encontrado:", data);
  return { 
    success: true, 
    data, 
    error: null 
  };
}

/**
 * Atualizar perfil
 */
export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

// ============================================================================
// FUNÇÃO LEGADA (MANTER POR COMPATIBILIDADE)
// ============================================================================

export async function createUser(profile: any) {
  // 1. Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: profile.email,
    password: profile.password,
    options: {
      data: {
        name: profile.name || '' // Metadados opcionais
      }
    }
  });

  if (authError || !authData.user) {
    console.error("❌ [SUPABASE] Erro ao criar usuário:", authError);
    return { success: false, error: authError };
  }

  console.log("✅ [SUPABASE] Usuário criado:", authData.user.id);

  // 2. O TRIGGER automático já criou o registro em profiles!
  // Não precisa fazer INSERT manual

  // 3. Buscar o perfil criado automaticamente
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    console.error("❌ [SUPABASE] Erro ao buscar perfil:", profileError);
    // Mesmo com erro, retorna sucesso porque usuário foi criado
    return { 
      success: true, 
      data: { 
        id: authData.user.id, 
        email: profile.email 
      } 
    };
  }

  console.log("✅ [SUPABASE] Perfil encontrado:", profileData);

  return { success: true, data: profileData };
}