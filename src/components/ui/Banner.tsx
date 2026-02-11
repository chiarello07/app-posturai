'use client';

import React from 'react';
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle, Crown, Sparkles } from 'lucide-react';

/* ========================================
   🎨 BANNER COMPONENT
   Componente base reutilizável para banners
   de trial, notificações e CTAs
   ======================================== */

export type BannerVariant = 
  | 'trial-preview'    // Estado A: Preview do trial
  | 'trial-active'     // Estado B: Trial ativo
  | 'trial-expired'    // Estado C: Trial expirado
  | 'premium'          // Estado D: Usuário premium
  | 'info'             // Informação geral
  | 'success'          // Sucesso
  | 'warning'          // Aviso
  | 'error';           // Erro

export type BannerSize = 'sm' | 'md' | 'lg';

export interface BannerAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export interface BannerProps {
  /** Variante visual do banner */
  variant: BannerVariant;
  
  /** Título do banner */
  title: string;
  
  /** Descrição/subtítulo (opcional) */
  description?: string;
  
  /** Ações (botões) do banner */
  actions?: BannerAction[];
  
  /** Se pode ser fechado */
  dismissible?: boolean;
  
  /** Callback ao fechar */
  onDismiss?: () => void;
  
  /** Tamanho do banner */
  size?: BannerSize;
  
  /** Ícone customizado (opcional, senão usa padrão da variante) */
  icon?: React.ReactNode;
  
  /** Classe CSS adicional */
  className?: string;
  
  /** Se deve ter animação de entrada */
  animated?: boolean;
}

// Mapeamento de ícones por variante
const VARIANT_ICONS: Record<BannerVariant, React.ReactNode> = {
  'trial-preview': <Sparkles className="w-5 h-5" />,
  'trial-active': <CheckCircle2 className="w-5 h-5" />,
  'trial-expired': <AlertTriangle className="w-5 h-5" />,
  'premium': <Crown className="w-5 h-5" />,
  'info': <Info className="w-5 h-5" />,
  'success': <CheckCircle2 className="w-5 h-5" />,
  'warning': <AlertTriangle className="w-5 h-5" />,
  'error': <AlertCircle className="w-5 h-5" />,
};

// Classes CSS por variante
const VARIANT_CLASSES: Record<BannerVariant, string> = {
  'trial-preview': 'trial-state-preview border-2',
  'trial-active': 'trial-state-active border-2',
  'trial-expired': 'trial-state-expired border-2',
  'premium': 'trial-state-premium border-2',
  'info': 'bg-blue-50 border-blue-200 text-blue-800 border',
  'success': 'bg-green-50 border-green-200 text-green-800 border',
  'warning': 'bg-yellow-50 border-yellow-200 text-yellow-800 border',
  'error': 'bg-red-50 border-red-200 text-red-800 border',
};

// Classes de tamanho
const SIZE_CLASSES: Record<BannerSize, string> = {
  'sm': 'p-3 gap-2',
  'md': 'p-4 gap-3',
  'lg': 'p-5 gap-4',
};

export default function Banner({
  variant,
  title,
  description,
  actions = [],
  dismissible = false,
  onDismiss,
  size = 'md',
  icon,
  className = '',
  animated = true,
}: BannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const variantClasses = VARIANT_CLASSES[variant];
  const sizeClasses = SIZE_CLASSES[size];
  const defaultIcon = VARIANT_ICONS[variant];
  const animationClass = animated ? 'trial-banner-animation' : '';

  return (
    <div
      className={`
        flex items-start justify-between rounded-xl
        ${variantClasses}
        ${sizeClasses}
        ${animationClass}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Conteúdo Principal */}
      <div className="flex items-start gap-3 flex-1">
        {/* Ícone */}
        <div className="flex-shrink-0 mt-0.5">
          {icon || defaultIcon}
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm md:text-base leading-tight">
            {title}
          </h3>
          
          {description && (
            <p className="text-xs md:text-sm mt-1 opacity-90 leading-relaxed">
              {description}
            </p>
          )}

          {/* Ações (Mobile: Stack / Desktop: Inline) */}
          {actions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.loading}
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm
                    transition-all duration-200
                    ${action.variant === 'primary' 
                      ? 'cta-button-primary text-white'
                      : action.variant === 'secondary'
                      ? 'bg-white/50 hover:bg-white/80 border border-current'
                      : 'hover:bg-white/30'
                    }
                    ${action.loading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {action.loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Carregando...
                    </span>
                  ) : (
                    action.label
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botão de Fechar */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Fechar banner"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/* ========================================
   📚 EXEMPLOS DE USO
   ======================================== */

// Exemplo 1: Trial Preview (Estado A)
export function BannerTrialPreview({ onStartTrial }: { onStartTrial: () => void }) {
  return (
    <Banner
      variant="trial-preview"
      title="Experimente 7 dias grátis!"
      description="Acesso completo aos treinos D1-D7. Sem compromisso, cancele quando quiser."
      actions={[
        {
          label: 'Iniciar Trial Grátis',
          onClick: onStartTrial,
          variant: 'primary',
        },
      ]}
    />
  );
}

// Exemplo 2: Trial Ativo (Estado B)
export function BannerTrialActive({ daysRemaining }: { daysRemaining: number }) {
  return (
    <Banner
      variant="trial-active"
      title={`Trial Ativo - ${daysRemaining} dias restantes`}
      description="Aproveite seu acesso completo aos treinos D1-D7!"
      dismissible
    />
  );
}

// Exemplo 3: Trial Expirado (Estado C)
export function BannerTrialExpired({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <Banner
      variant="trial-expired"
      title="Seu trial expirou"
      description="Continue sua jornada com o plano Premium e tenha acesso ilimitado!"
      actions={[
        {
          label: 'Ver Planos',
          onClick: onUpgrade,
          variant: 'primary',
        },
      ]}
    />
  );
}

// Exemplo 4: Premium (Estado D)
export function BannerPremium() {
  return (
    <Banner
      variant="premium"
      title="Você é Premium! 👑"
      description="Aproveite acesso ilimitado a todos os treinos e recursos."
      size="sm"
      dismissible
    />
  );
}