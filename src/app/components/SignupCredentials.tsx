"use client";

import { useState } from "react";
import { createUser, loginUser } from "@/lib/supabase";

interface Props {
  onContinue: (email: string, password: string) => void;
  onBack: () => void;
}

export default function SignupCredentials({ onContinue, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    // Validações
    if (!email.includes("@")) {
      setError("Digite um email válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      console.log("📧 [SIGNUP] Tentando criar usuário...", { email });

      // 1. Criar usuário no Supabase
      const createResult = await createUser({ email, password });

      console.log("📧 [SIGNUP] Resultado createUser:", createResult);

      if (!createResult.success) {
        // Extrair mensagem de erro do objeto
        const errorMessage = typeof createResult.error === 'string' 
          ? createResult.error 
          : createResult.error?.message || JSON.stringify(createResult.error) || "Erro ao criar conta";
        
        console.error("❌ [SIGNUP] Erro ao criar usuário:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("✅ [SIGNUP] Usuário criado com sucesso!");

      // 2. Fazer login automático
      console.log("🔐 [SIGNUP] Fazendo login automático...");
      const loginResult = await loginUser(email, password);

      console.log("🔐 [SIGNUP] Resultado loginUser:", loginResult);

      if (!loginResult.success) {
        const loginErrorMessage = typeof loginResult.error === 'string'
          ? loginResult.error
          : loginResult.error?.message || "Erro ao fazer login após criar conta";
        
        console.error("❌ [SIGNUP] Erro ao fazer login:", loginErrorMessage);
        throw new Error(loginErrorMessage);
      }

      console.log("✅ [SIGNUP] Login automático realizado!");

      // 3. Sucesso! Ir para onboarding
      onContinue(email, password);
    } catch (err: any) {
      console.error("❌ [SIGNUP] Erro geral:", err);
      setError(err.message || "Erro ao criar conta. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold text-white mb-8">Criar Conta</h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full max-w-md bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-xl mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Senha"
        className="w-full max-w-md bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-xl mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Confirmar senha"
        className="w-full max-w-md bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-xl mb-4"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        disabled={loading}
      />

      {error && (
        <div className="w-full max-w-md mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full max-w-md bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold mb-4 disabled:opacity-50"
      >
        {loading ? "Criando conta..." : "Continuar"}
      </button>

      <button
        onClick={onBack}
        disabled={loading}
        className="w-full max-w-md bg-gray-800 text-white py-4 rounded-xl font-bold disabled:opacity-50"
      >
        Voltar
      </button>
    </div>
  );
}