"use client";

import { useEffect, useState } from "react";
import { 
  Trophy, 
  Crown, 
  Check, 
  Loader2,
  ArrowLeft,
  Shield,
  Lock
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser, type User } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // URL do checkout Kirvano
  const KIRVANO_CHECKOUT_URL = "https://pay.kirvano.com/15b0c049-9493-42c6-a3dc-48797eaf6973";

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    
    if (!currentUser) {
      router.push("/");
    }
  }

  function handleCheckout() {
    if (!user) return;
    
    // Adiciona o email do usuário como parâmetro na URL do Kirvano
    const checkoutUrl = `${KIRVANO_CHECKOUT_URL}?email=${encodeURIComponent(user.email)}`;
    
    // Redireciona para o checkout do Kirvano
    window.location.href = checkoutUrl;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  SmartHub
                </h1>
                <p className="text-xs text-slate-400">Checkout Seguro</p>
              </div>
            </Link>
            
            <Link 
              href="/vip"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full mb-6">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">Checkout VIP Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Finalize Sua Assinatura
            </h1>
            <p className="text-slate-400 text-lg">
              Você está a um passo de ter acesso ilimitado às melhores tips do mercado
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm border-2 border-amber-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Plano VIP Premium</h2>
                  <p className="text-slate-400">Assinatura Mensal</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-slate-400">Valor mensal</span>
                  <div className="text-right">
                    <span className="text-4xl font-bold text-amber-400">R$ 99,90</span>
                    <span className="text-slate-400 text-sm">/mês</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 text-right">Cancele quando quiser</p>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase">O que está incluído:</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Tips premium ilimitadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">92% de taxa de acerto</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Análises detalhadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Notificações em tempo real</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Suporte prioritário 24/7</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-400 mb-1">Garantia de 7 dias</p>
                    <p className="text-xs text-slate-400">
                      Se não ficar satisfeito, devolvemos 100% do seu dinheiro
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Informações de Pagamento</h2>

              {user && (
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-400 mb-1">Conta vinculada:</p>
                  <p className="text-white font-semibold">{user.email}</p>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>Processado por Kirvano</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>Acesso imediato após confirmação</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>Cancele quando quiser</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Ir Para Pagamento Seguro
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-4">Formas de pagamento aceitas:</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="bg-slate-800/50 px-6 py-3 rounded-lg border border-white/10">
                <p className="text-white font-semibold">💳 Cartão de Crédito</p>
              </div>
              <div className="bg-slate-800/50 px-6 py-3 rounded-lg border border-white/10">
                <p className="text-white font-semibold">🔐 Pix</p>
              </div>
              <div className="bg-slate-800/50 px-6 py-3 rounded-lg border border-white/10">
                <p className="text-white font-semibold">📱 Boleto</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl">
                <Trophy className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <p className="font-bold text-white">SmartHub - Tips</p>
                <p className="text-xs text-slate-400">Apostas Inteligentes</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              © 2024 SmartHub. Jogue com responsabilidade. +18
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
