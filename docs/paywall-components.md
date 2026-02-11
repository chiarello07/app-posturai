# 📚 Documentação - Sistema de Paywall & Trial

**Última atualização:** 07/01/2026  
**Autor:** OXOSSI - Refatoração  
**Versão:** 1.0.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Estados do Trial](#estados-do-trial)
4. [Componentes](#componentes)
5. [Tokens CSS](#tokens-css)
6. [Fluxos de Usuário](#fluxos-de-usuário)
7. [Guia de Implementação](#guia-de-implementação)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **Sistema de Paywall & Trial** do Posturai gerencia o acesso dos usuários aos treinos com base em 4 estados distintos, proporcionando uma experiência de conversão otimizada.

### Objetivos do Sistema

- ✅ **Conversão**: Trial baseado em intenção (não automático)
- ✅ **Transparência**: Usuário sempre sabe seu status
- ✅ **Flexibilidade**: Fácil adicionar novos componentes
- ✅ **Consistência**: Design system unificado

---

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
/src
├── /components
│   ├── /ui
│   │   └── Banner.tsx          # Componente base de banners
│   ├── TrialBanner.tsx         # Banner superior de trial
│   ├── TrialGateCard.tsx       # Bloqueio de conteúdo
│   ├── TrialWeekStrip.tsx      # Indicador de dias
│   └── PaywallModal.tsx        # Modal de conversão
│
├── /contexts
│   └── TrialContext.tsx        # Estado global do trial
│
├── /app
│   └── globals.css             # Tokens CSS
│
└── /lib
    └── supabase.ts             # Cliente Supabase
```

### Fluxo de Dados
```
┌─────────────────┐
│  Supabase DB    │
│  (user_profile) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  TrialContext   │ ← Estado global
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Componentes de Paywall     │
│  - TrialBanner              │
│  - TrialGateCard            │
│  - PaywallModal             │
└─────────────────────────────┘
```

---

## 🔄 Estados do Trial

O sistema possui **4 estados** distintos baseados nos campos do banco de dados:

### Estado A: Preview (Não iniciou trial)

**Condição:**
```typescript
trialStartedAt === null
```

**Comportamento:**
- ✅ Mostra preview do D1 (Dia 1)
- ✅ CTA: "Iniciar Trial Grátis"
- ❌ D2-D365 bloqueados com TrialGateCard

**Componentes ativos:**
```tsx
<BannerTrialPreview />
<TrialGateCard locked={true} />
```

---

### Estado B: Trial Ativo

**Condição:**
```typescript
trialStartedAt !== null &&
trialEndsAt > now() &&
subscriptionStatus !== 'active'
```

**Comportamento:**
- ✅ D1-D7 liberados completamente
- ❌ D8+ bloqueado com modal de conversão
- ✅ Banner mostra dias restantes

**Componentes ativos:**
```tsx
<BannerTrialActive daysRemaining={X} />
<TrialWeekStrip currentDay={X} />
<PaywallModal /> {/* ao tentar D8+ */}
```

---

### Estado C: Trial Expirado

**Condição:**
```typescript
trialEndsAt < now() &&
subscriptionStatus !== 'active'
```

**Comportamento:**
- ❌ Todo conteúdo bloqueado
- ✅ Modal de conversão persistente
- ✅ CTA: "Ver Planos"

**Componentes ativos:**
```tsx
<BannerTrialExpired />
<PaywallModal persistent={true} />
```

---

### Estado D: Premium (Assinante)

**Condição:**
```typescript
subscriptionStatus === 'active'
```

**Comportamento:**
- ✅ Acesso ilimitado a D1-D365
- ✅ Badge "Premium" na UI
- ✅ Sem restrições

**Componentes ativos:**
```tsx
<BannerPremium /> {/* opcional, dismissível */}
```

---

## 🧩 Componentes

### 1. Banner (Base Component)

**Localização:** `/src/components/ui/Banner.tsx`

**Props:**
```typescript
interface BannerProps {
  title: string;                 // Título principal
  description?: string;          // Subtítulo
  actions?: BannerAction[];      // Botões
  dismissible?: boolean;         // Pode fechar?
  onDismiss?: () => void;        // Callback ao fechar
  icon?: React.ReactNode;        // Ícone customizado
  className?: string;            // Classes adicionais
  animated?: boolean;            // Animação de entrada
}
```

**Exemplo de uso:**
```tsx
import Banner from '@/components/ui/Banner';

<Banner
  variant="trial-active"
  title="Trial Ativo - 5 dias restantes"
  description="Aproveite seu acesso aos treinos D1-D7!"
  actions={[
    {
      label: 'Ver Planos',
      onClick: () => router.push('/planos'),
      variant: 'primary'
    }
  ]}
  dismissible
/>
```

---

### 2. TrialBanner

**Localização:** `/src/components/TrialBanner.tsx`

**Descrição:** Banner fixo no topo que mostra o status do trial.

**Props:**
```typescript
interface TrialBannerProps {
  daysRemaining?: number;
  onStartTrial: () => void;
  onUpgrade: () => void;
}
```

**Estados visuais:**
- **Estado A**: Roxo/Rosa - "Experimente 7 dias grátis"
- **Estado B**: Verde - "Trial ativo - X dias restantes"
- **Estado C**: Vermelho - "Trial expirado"
- **Estado D**: Dourado - "Você é Premium"

---

### 3. TrialGateCard

**Localização:** `/src/components/TrialGateCard.tsx`

**Descrição:** Card de bloqueio que aparece sobre conteúdo restrito.

**Props:**
```typescript
interface TrialGateCardProps {
  locked: boolean;               // Se está bloqueado
  dayNumber: number;             // Número do dia (1-365)
  onUnlock: () => void;          // Ação ao clicar em desbloquear
  variant?: 'trial' | 'premium'; // Tipo de bloqueio
}
```

**Exemplo:**
```tsx
<TrialGateCard
  locked={dayNumber > 7 && !isPremium}
  dayNumber={dayNumber}
  onUnlock={() => setShowPaywall(true)}
  variant={hasTrialEnded ? 'premium' : 'trial'}
/>
```

---

### 4. TrialWeekStrip

**Localização:** `/src/components/TrialWeekStrip.tsx`

**Descrição:** Indicador visual dos 7 dias do trial.

**Props:**
```typescript
interface TrialWeekStripProps {
  currentDay: number;            // Dia atual (1-7)
  completedDays: number[];       // Dias já completados
  onDayClick?: (day: number) => void; // Callback ao clicar
}
```

**Visual:**
```
[✓] [✓] [•] [ ] [ ] [ ] [ ]
 D1  D2  D3  D4  D5  D6  D7
```

---

### 5. PaywallModal

**Localização:** `/src/components/PaywallModal.tsx`

**Descrição:** Modal de conversão que aparece ao tentar acessar conteúdo premium.

**Props:**
```typescript
interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: 'trial-expired' | 'locked-content';
  dayNumber?: number;
}
```

**Comportamento:**
- **Trial Expired**: Não pode fechar (overlay não dismissível)
- **Locked Content**: Pode fechar clicando fora

---

## 🎨 Tokens CSS

### Variáveis Principais
```css
/* Gradientes */
--gradient-primary: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
--gradient-trial: linear-gradient(to right, #ec4899, #a855f7);
--gradient-premium: linear-gradient(to right, #f59e0b, #eab308);

/* Estados de Trial */
--trial-preview-bg: #fdf4ff;
--trial-active-bg: #f0fdf4;
--trial-expired-bg: #fef2f2;
--trial-premium-bg: #fffbeb;

/* Botões CTA */
--cta-primary-bg: var(--gradient-primary);
--cta-primary-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.3);
```

### Classes Utilitárias
```css
.gradient-primary           /* Gradiente rosa→roxo */
.trial-state-preview        /* Background + border do Estado A */
.trial-state-active         /* Background + border do Estado B */
.trial-state-expired        /* Background + border do Estado C */
.trial-state-premium        /* Background + border do Estado D */
.cta-button-primary         /* Botão primário com hover/shadow */
.content-locked             /* Blur no conteúdo bloqueado */
```

### Animações
```css
.trial-banner-animation     /* Slide in from top */
.paywall-modal-animation    /* Scale in */
.paywall-overlay-animation  /* Fade in */
```

---

## 🔄 Fluxos de Usuário

### Fluxo 1: Novo Usuário (Estado A → B)
```
1. Usuário cria conta
2. Faz análise postural
3. Treino é gerado
4. Vê preview do D1
5. Banner mostra: "Experimente 7 dias grátis"
6. Clica em "Iniciar Trial"
   ↓
7. trialStartedAt = now()
8. trialEndsAt = now() + 7 dias
   ↓
9. Estado muda para B
10. D1-D7 liberados
11. Banner mostra: "Trial ativo - 7 dias restantes"
```

---

### Fluxo 2: Trial Ativo (Estado B → D)
```
1. Usuário em trial (Estado B)
2. Clica em treino D8+
   ↓
3. PaywallModal abre
4. Mostra planos disponíveis
5. Usuário clica em "Assinar Mensal"
   ↓
6. Redireciona para Stripe Checkout
7. Pagamento confirmado
   ↓
8. Webhook atualiza:
   - subscriptionStatus = 'active'
   - subscriptionId = 'sub_xxx'
   ↓
9. Estado muda para D
10. Acesso ilimitado
11. Badge "Premium" aparece
```

---

### Fluxo 3: Trial Expira (Estado B → C)
```
1. Usuário em trial (Estado B)
2. trialEndsAt < now()
   ↓
3. Estado muda automaticamente para C
4. PaywallModal abre (persistente)
5. Banner muda para: "Trial expirado"
   ↓
6. Usuário pode:
   a) Assinar → Estado D
   b) Fechar app → Permanece C"
```

---

## 🛠️ Guia de Implementação

### Passo 1: Instalar Dependências
```bash
npm install lucide-react
```

### Passo 2: Adicionar Tokens CSS

Copie o conteúdo de tokens CSS para `/src/app/globals.css`

### Passo 3: Criar Componente Banner

Crie `/src/components/ui/Banner.tsx` com o código fornecido.

### Passo 4: Usar nos Componentes Existentes

**Em TrialBanner.tsx:**
```tsx
import { BannerTrialPreview, BannerTrialActive } from '@/components/ui/Banner';

// Substituir código antigo por:
{trialState === 'A' && (
  <BannerTrialPreview onStartTrial={handleStartTrial} />
)}

{trialState === 'B' && (
  <BannerTrialActive daysRemaining={daysRemaining} />
)}
```

### Passo 5: Testar Estados
```tsx
// Simular Estado A
localStorage.removeItem('trialStartedAt');

// Simular Estado B
localStorage.setItem('trialStartedAt', new Date().toISOString());
localStorage.setItem('trialEndsAt', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

// Simular Estado C
localStorage.setItem('trialEndsAt', new Date(Date.now() - 1000).toISOString());

// Simular Estado D
localStorage.setItem('subscriptionStatus', 'active');
```

---

## 🐛 Troubleshooting

### Problema: Banner não aparece

**Causa:** Tokens CSS não importados

**Solução:**
```tsx
// Verificar em layout.tsx ou page.tsx:
import '@/app/globals.css';
```

---

### Problema: Botões sem estilo

**Causa:** Classes CSS não aplicadas

**Solução:**
```tsx
// Usar classes do design system:
className="cta-button-primary"
```

---

### Problema: Animações não funcionam

**Causa:** Classes de animação faltando

**Solução:**
```tsx
// Adicionar prop animated:
<Banner animated={true} ... />
```

---

### Problema: Dark mode não funciona

**Causa:** Variáveis CSS não definidas para dark mode

**Solução:** Já implementado no globals.css com `@media (prefers-color-scheme: dark)`

---

## 📞 Contato

**Dúvidas ou sugestões?**  
Documentação mantida por: **OXOSSI - Refatoração**  
Última revisão: **07/01/2026**


---

## 📝 Changelog

### v1.0.0 (07/01/2026)
- ✅ Criação inicial da documentação
- ✅ Tokens CSS implementados
- ✅ Componente Banner criado
- ✅ Exemplos de uso adicionados
- ✅ Fluxos de usuário documentados
```