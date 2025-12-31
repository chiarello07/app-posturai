"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { createUser, loginUser } from "@/lib/supabase";

interface AuthScreenProps {
  onLoginSuccess: (userId: string) => void;
  onSignupSuccess: (userId: string) => void;
}

export default function AuthScreen({ onLoginSuccess, onSignupSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  // Validações básicas
  if (!email || !password) {
    setError("Por favor, preencha todos os campos");
    setLoading(false);
    return;
  }

  if (!isLogin && !name) {
    setError("Por favor, informe seu nome");
    setLoading(false);
    return;
  }

  if (password.length < 6) {
    setError("A senha deve ter no mínimo 6 caracteres");
    setLoading(false);
    return;
  }

  try {
    if (isLogin) {
      // LOGIN
      console.log("🔐 Fazendo login...");
      const result = await loginUser(email, password);
      
      if (!result.success) {
        setError(result.error?.message || "Erro ao fazer login. Verifique suas credenciais.");
        setLoading(false);
        return;
      }

      console.log("✅ Login bem-sucedido! userId:", result.data!.id);
      onLoginSuccess(result.data!.id);
    } else {
      // SIGNUP
      console.log("📝 Criando conta...");
      const result = await createUser(email, password);
      
      if (!result.success) {
        if (result.error?.message?.includes("already registered")) {
          setError("Este email já está cadastrado. Tente fazer login.");
        } else {
          setError(result.error?.message || "Erro ao criar conta. Tente novamente.");
        }
        setLoading(false);
        return;
      }

      console.log("✅ Conta criada com sucesso! userId:", result.data!.id);
      onSignupSuccess(result.data!.id);
    }
  } catch (err: any) {
    console.error("❌ Erro na autenticação:", err);
    setError("Erro inesperado. Tente novamente.");
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 rounded-3xl mb-4 shadow-2xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            PosturAI
          </h1>
          <p className="text-gray-400">
            Seu assistente inteligente de postura e treino
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isLogin ? "Entrar" : "Criar Conta"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (apenas no cadastro) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Digite seu nome"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isLogin ? "Entrando..." : "Criando conta..."}
                </span>
              ) : (
                <span>{isLogin ? "Entrar" : "Criar Conta"}</span>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                disabled={loading}
                className="text-pink-400 font-semibold hover:text-pink-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogin ? "Faça seu cadastro agora" : "Entrar"}
              </button>
            </p>
          </div>

          {/* Forgot Password (apenas no login) */}
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                disabled={loading}
                className="text-gray-500 text-sm hover:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Ao continuar, você concorda com nossos{" "}
          <button className="text-pink-400 hover:text-pink-300">
            Termos de Uso
          </button>{" "}
          e{" "}
          <button className="text-pink-400 hover:text-pink-300">
            Política de Privacidade
          </button>
        </p>
      </div>
    </div>
  );
}