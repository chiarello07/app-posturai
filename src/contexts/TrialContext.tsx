'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

// ============================================
// TIPOS E INTERFACES
// ============================================

export type UserState = 'A' | 'B' | 'C' | 'D';

export interface TrialContextType {
  // Estado do usuário
  userState: UserState;
  
  // Informações do usuário
  isPremium: boolean;
  isTrialActive: boolean;
  trialStartedAt: string | null;
  trialDaysRemaining: number;
  
  // Funções
  startTrial: () => Promise<void>;
  refetchUserData: () => Promise<void>;
  
  // Loading
  isLoading: boolean;
}

// ============================================
// CONTEXTO
// ============================================

const TrialContext = createContext<TrialContextType | undefined>(undefined);

export const useTrialContext = () => {
  const context = useContext(TrialContext);
  if (!context) {
    throw new Error('useTrialContext must be used within TrialProvider');
  }
  return context;
};

// ============================================
// PROVIDER
// ============================================

export const TrialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>('A');
  const [isPremium, setIsPremium] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialStartedAt, setTrialStartedAt] = useState<string | null>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // ============================================
// FUNÇÃO: Calcular Estado do Usuário
// ============================================
const calculateUserState = (
  premium: boolean,
  trialStarted: string | null,
  subscriptionStatus: string | null,
  premiumExpiresAt: string | null
): UserState => {

  // ✅ Estado D: qualquer sinal de premium ativo
  const isActivePremium =
    premium === true ||
    subscriptionStatus === 'active' ||
    subscriptionStatus === 'trialing' ||
    (premiumExpiresAt && new Date(premiumExpiresAt) > new Date());

  if (isActivePremium) return 'D';

  // Estado A: nunca iniciou trial
  if (!trialStarted) return 'A';

  // Calcular dias do trial
  const startDate = new Date(trialStarted);
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Estado B: trial ativo (dias 0-6)
  if (diffDays < 7) return 'B';

  // Estado C: trial expirado
  return 'C';
};

  // ============================================
// FUNÇÃO: Calcular Dias Restantes do Trial
// ============================================
const calculateDaysRemaining = (trialStarted: string | null): number => {
  if (!trialStarted) return 0;

  const startDate = new Date(trialStarted);
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const remaining = 7 - diffDays;
  return remaining > 0 ? remaining : 0;
};

  // ============================================
// FUNÇÃO: Buscar Dados do Usuário
// ============================================
const fetchUserData = async () => {
  try {
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setUserState('A');
      setIsLoading(false);
      return;
    }

    // ✅ FIX: busca TODOS os campos relevantes
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_premium, trial_started_at, subscription_status, premium_expires_at, subscription_tier')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      setIsLoading(false);
      return;
    }

    const premium = profile?.is_premium === true;
    const trialStarted = profile?.trial_started_at || null;
    const subscriptionStatus = profile?.subscription_status || null;
    const premiumExpiresAt = profile?.premium_expires_at || null;

    // ✅ FIX: lógica robusta considerando todos os campos
    const state = calculateUserState(premium, trialStarted, subscriptionStatus, premiumExpiresAt);
    const daysRemaining = calculateDaysRemaining(trialStarted);

    setIsPremium(premium);
    setTrialStartedAt(trialStarted);
    setUserState(state);
    setTrialDaysRemaining(daysRemaining);
    setIsTrialActive(state === 'B');

  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
  } finally {
    setIsLoading(false);
  }
};

  // ============================================
  // FUNÇÃO: Iniciar Trial
  // ============================================
  const startTrial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se já iniciou o trial
      const { data: profile } = await supabase
        .from('profiles')
        .select('trial_started_at')
        .eq('id', user.id)
        .single();

      if (profile?.trial_started_at) {
        console.log('Trial já foi iniciado anteriormente');
        await fetchUserData();
        return;
      }

      // Iniciar trial (gravar timestamp)
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('profiles')
        .update({ trial_started_at: now })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Atualizar contexto
      await fetchUserData();
      
      console.log('✅ Trial iniciado com sucesso!');
    } catch (error) {
      console.error('Erro ao iniciar trial:', error);
      throw error;
    }
  };

  // ============================================
  // FUNÇÃO: Re-fetch Manual
  // ============================================
  const refetchUserData = async () => {
    await fetchUserData();
  };

  // ============================================
  // EFFECT: Carregar dados na inicialização
  // ============================================
  useEffect(() => {
    fetchUserData();
  }, []);

  // ============================================
  // PROVIDER VALUE
  // ============================================
  const value: TrialContextType = {
    userState,
    isPremium,
    isTrialActive,
    trialStartedAt,
    trialDaysRemaining,
    startTrial,
    refetchUserData,
    isLoading,
  };

  return <TrialContext.Provider value={value}>{children}</TrialContext.Provider>;
};