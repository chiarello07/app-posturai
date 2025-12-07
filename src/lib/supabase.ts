// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { TrainingPlan, TrainingPrescription, UserWorkout, WorkoutHistory } from '@/types/training';

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
  main_goals: string[];
  experience_level: string;
  gender?: string;
  last_period_start?: string;
  last_period_end?: string;
  exercise_frequency: string;
  dedication_hours: number;
  weight?: number;
  height?: number;
  pain_areas?: string[] | null;
  injuries: string;
  injury_details?: string;
  heart_problems: string;
  heart_problems_details?: string;
  phone: string;
  occupation: string;
  work_hours: number;
  work_position: string;
  drinks: string;
  smoker: string;
  sleep_hours: string;
  meals_per_day: string;
  supplements: string;
  nutrition_plan: string;
  favorite_activity: string;
  training_time: string;
  completed: boolean;
}

// ============================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================================================

/**
 * Criar novo usuário (signup) e fazer login automaticamente
 */
export async function createUser(email: string, password: string) {
  console.log("📝 [createUser] Parâmetros recebidos:", { email, password: "***" });
  console.log("📝 [createUser] Tipo do email:", typeof email);
  console.log("📝 [createUser] Tipo do password:", typeof password);

  if (!email || typeof email !== 'string') {
    console.error("❌ [createUser] Email inválido:", email);
    return { 
      success: false, 
      error: { message: "Email inválido ou undefined" }, 
      data: null 
    };
  }

  if (!password || typeof password !== 'string') {
    console.error("❌ [createUser] Password inválido:", password);
    return { 
      success: false, 
      error: { message: "Password inválido ou undefined" }, 
      data: null 
    };
  }

  console.log("✅ [createUser] Validação OK! Criando usuário:", email);

  try {
    // 1. Criar usuário no Supabase Auth
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: email.split('@')[0]
        },
        emailRedirectTo: undefined
      }
    });

    if (signupError) {
      console.error("❌ [createUser] Erro ao criar:", signupError);
      return { success: false, error: signupError, data: null };
    }

    if (!signupData.user) {
      return { 
        success: false, 
        error: { message: "Erro ao criar usuário" }, 
        data: null 
      };
    }

    console.log("✅ [createUser] Usuário criado! ID:", signupData.user.id);

    // 2. Aguardar trigger criar perfil
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. Fazer login para estabelecer sessão
    console.log("🔐 [createUser] Fazendo login automático...");
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      console.error("❌ [createUser] Erro no login automático:", loginError);
      return { 
        success: true, 
        data: signupData.user, 
        error: null 
      };
    }

    console.log("✅ [createUser] Login automático bem-sucedido!");

    return { 
      success: true, 
      data: loginData.user, 
      error: null 
    };
  } catch (err: any) {
    console.error("❌ [createUser] Erro inesperado:", err);
    return { 
      success: false, 
      error: { message: err.message }, 
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
 * Obter usuário atual (sem lançar erro se não houver sessão)
 */
export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log("Nenhuma sessão ativa");
      return null;
    }
    
    if (!session?.user) {
      return null;
    }

    return session.user;
  } catch (err) {
    console.log("Erro ao verificar sessão:", err);
    return null;
  }
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
// FUNÇÕES DE ONBOARDING
// ============================================================================

/**
 * Salvar dados completos do onboarding
 */
export async function saveOnboarding(data: Partial<OnboardingData>) {
  console.log("💾 [SAVE ONBOARDING] ===== INÍCIO =====");
  console.log("💾 [SAVE ONBOARDING] Dados recebidos:", JSON.stringify(data, null, 2));
  
  const onboardingPayload = {
    ...data,
    updated_at: new Date().toISOString()
  };

  console.log("💾 [SAVE ONBOARDING] Payload para onboarding:", JSON.stringify(onboardingPayload, null, 2));

  // 1. SALVAR NA TABELA ONBOARDING
  const { data: onboardingData, error } = await supabase
    .from('onboarding')
    .upsert(onboardingPayload, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  console.log("💾 [SAVE ONBOARDING] Resultado do upsert:");
  console.log("  - data:", onboardingData);
  console.log("  - error:", error);

  if (error) {
    console.error("❌ [SAVE ONBOARDING] Erro ao salvar onboarding:");
    console.error("  - Erro completo:", error);
    console.error("  - message:", error?.message);
    console.error("  - details:", error?.details);
    console.error("  - hint:", error?.hint);
    console.error("  - code:", error?.code);
    console.error("  - Payload que tentou salvar:", JSON.stringify(onboardingPayload, null, 2));
    
    return { success: false, error };
  }

  console.log("✅ [SAVE ONBOARDING] Onboarding salvo:", onboardingData);

  // 2. ATUALIZAR DADOS EM PROFILES
  if (data.user_id && data.name) {
    console.log("💾 [SAVE ONBOARDING] Atualizando profiles...");
    
    const profileUpdate: any = {
      name: data.name,
      updated_at: new Date().toISOString()
    };

    if (data.gender) profileUpdate.gender = data.gender;
    if (data.last_period_start) profileUpdate.last_period_start = data.last_period_start;
    if (data.last_period_end) profileUpdate.last_period_end = data.last_period_end;
    if (data.weight !== undefined && data.weight !== null) profileUpdate.weight = data.weight;
    if (data.height !== undefined && data.height !== null) profileUpdate.height = data.height;

    console.log("💾 [SAVE ONBOARDING] Payload para profiles:", JSON.stringify(profileUpdate, null, 2));

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', data.user_id)
      .select()
      .single();

    console.log("💾 [SAVE ONBOARDING] Resultado update profiles:");
    console.log("  - data:", profileData);
    console.log("  - error:", profileError);

    if (profileError) {
      console.error("❌ [SAVE ONBOARDING] Erro ao atualizar profiles:", profileError);
    } else {
      console.log("✅ [SAVE ONBOARDING] Profiles atualizado com sucesso!");
    }
  } else {
    console.warn("⚠️ [SAVE ONBOARDING] Pulando update de profiles (sem user_id ou name)");
  }

  console.log("💾 [SAVE ONBOARDING] ===== FIM =====");
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
// FUNÇÕES DE ANÁLISE POSTURAL
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

  const { data, error } = await supabase.storage
    .from('postural-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    return { success: false, error };
  }

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

  const frontalResult = await uploadPhoto(userId, photos.frontal, 'frontal');
  if (!frontalResult.success) {
    return { success: false, error: frontalResult.error };
  }
  results.frontal = frontalResult.url!;

  const lateralEsqResult = await uploadPhoto(userId, photos.lateralEsquerdo, 'lateral-esquerdo');
  if (!lateralEsqResult.success) {
    return { success: false, error: lateralEsqResult.error };
  }
  results.lateralEsquerdo = lateralEsqResult.url!;

  const lateralDirResult = await uploadPhoto(userId, photos.lateralDireito, 'lateral-direito');
  if (!lateralDirResult.success) {
    return { success: false, error: lateralDirResult.error };
  }
  results.lateralDireito = lateralDirResult.url!;

  const costasResult = await uploadPhoto(userId, photos.costas, 'costas');
  if (!costasResult.success) {
    return { success: false, error: costasResult.error };
  }
  results.costas = costasResult.url!;

  return { success: true, urls: results };
}

// ============================================================================
// FUNÇÕES DE TREINO - TRAINING PRESCRIPTIONS
// ============================================================================

/**
 * Criar prescrição de treino
 */
export async function createTrainingPrescription(userId: string, plan: TrainingPlan) {
  const { data, error } = await supabase
    .from('training_prescriptions')
    .insert({
      user_id: userId,
      plan: plan
    })
    .select()
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao criar prescrição:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Obter última prescrição de treino
 */
export async function getLatestTrainingPrescription(userId: string) {
  const { data, error } = await supabase
    .from('training_prescriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao buscar prescrição:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================================================
// FUNÇÕES DE TREINO - USER WORKOUTS
// ============================================================================

/**
 * Criar workout do usuário
 */
export async function createUserWorkout(userId: string, plan: TrainingPlan, phase: string = 'A') {
  const { data, error } = await supabase
    .from('user_workouts')
    .insert({
      user_id: userId,
      plan: plan,
      phase: phase
    })
    .select()
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao criar workout:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Obter workout atual do usuário
 */
export async function getUserWorkout(userId: string) {
  const { data, error } = await supabase
    .from('user_workouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao buscar workout:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Atualizar fase do workout
 */
export async function updateUserWorkoutPhase(workoutId: string, phase: string) {
  const { data, error } = await supabase
    .from('user_workouts')
    .update({
      phase: phase,
      updated_at: new Date().toISOString()
    })
    .eq('id', workoutId)
    .select()
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao atualizar fase:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================================================
// FUNÇÕES DE TREINO - WORKOUT HISTORY
// ============================================================================

/**
 * Registrar conclusão de treino
 */
export async function logWorkoutCompletion(
  userId: string,
  workoutId: string,
  durationMinutes: number,
  notes?: string,
  exercisesCompleted?: any[]
) {
  const { data, error } = await supabase
    .from('workout_history')
    .insert({
      user_id: userId,
      workout_id: workoutId,
      duration_minutes: durationMinutes,
      notes: notes,
      exercises_completed: exercisesCompleted
    })
    .select()
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao registrar treino:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Obter histórico de treinos
 */
export async function getWorkoutHistory(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error("❌ [SUPABASE] Erro ao buscar histórico:", error);
    return { success: false, error };
  }

  return { success: true, data };
}