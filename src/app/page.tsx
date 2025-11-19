"use client";

import { useState, useEffect } from "react";
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Calendar,
  Clock,
  ChevronRight,
  Flame,
  Star,
  Users,
  BarChart3,
  Shield,
  Zap,
  Lock,
  Sparkles,
  ExternalLink,
  Crown,
  LogOut,
  Mail
} from "lucide-react";
import Link from "next/link";
import { getTips, getStatistics } from "@/lib/tips-service";
import { getCurrentUser, signOut, signIn, signUp, type User } from "@/lib/auth";
import type { Database } from "@/lib/database.types";

type Sport = "nba" | "futebol";
type Tip = Database['public']['Tables']['tips']['Row'];
type Statistics = Database['public']['Tables']['statistics']['Row'];

export default function SmartHubTips() {
  const [selectedSport, setSelectedSport] = useState<Sport>("nba");
  const [tips, setTips] = useState<Tip[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  // Cores dinâmicas baseadas no mercado com transições suavizadas
  const sportColors = {
    nba: {
      gradient: "from-orange-500 to-red-500",
      shadow: "shadow-orange-500/30",
      border: "border-orange-500/30",
      text: "text-orange-400",
      bg: "bg-orange-500/20",
      hover: "hover:border-orange-500/50"
    },
    futebol: {
      gradient: "from-emerald-500 to-cyan-500",
      shadow: "shadow-emerald-500/30",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      bg: "bg-emerald-500/20",
      hover: "hover:border-emerald-500/50"
    }
  };

  const currentColors = sportColors[selectedSport];

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [selectedSport, user]);

  async function checkAuth() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    
    if (!currentUser) {
      setShowAuthModal(true);
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      const [tipsData, statsData] = await Promise.all([
        getTips(selectedSport, undefined),
        getStatistics()
      ]);
      setTips(tipsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      let result;
      if (authMode === 'signup') {
        result = await signUp(email, password, name);
      } else {
        result = await signIn(email, password);
      }

      if (result) {
        setUser(result);
        setShowAuthModal(false);
        setAuthError('');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setAuthError(error.message || 'Erro ao autenticar. Tente novamente.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    setUser(null);
    setShowAuthModal(true);
  }

  const getStatusColor = (status: Tip['status']) => {
    switch(status) {
      case "green": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "red": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  const getStatusText = (status: Tip['status']) => {
    switch(status) {
      case "green": return "GREEN ✓";
      case "red": return "RED ✗";
      case "pending": return "AGUARDANDO";
    }
  };

  // Separar tips gratuitas e VIP
  const freeTips = tips.filter(tip => !tip.is_vip).slice(0, 5);
  const vipTips = tips.filter(tip => tip.is_vip);

  // Modal de autenticação
  if (showAuthModal && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              SmartHub Tips
            </h1>
            <p className="text-slate-400">
              {authMode === 'login' ? 'Entre para acessar' : 'Crie sua conta'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{authError}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30"
            >
              {authLoading ? 'Processando...' : authMode === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                setAuthError('');
              }}
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 transition-all duration-700 ease-in-out">
      {/* Header com transição suave */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50 transition-all duration-700 ease-in-out">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${currentColors.gradient} p-2 rounded-xl transition-all duration-700 ease-in-out`}>
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${currentColors.gradient} bg-clip-text text-transparent transition-all duration-700 ease-in-out`}>
                  SmartHub
                </h1>
                <p className="text-xs text-slate-400">Tips Profissionais</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`hidden md:flex items-center gap-2 ${currentColors.bg} border ${currentColors.border} px-4 py-2 rounded-lg transition-all duration-700 ease-in-out`}>
                <Flame className={`w-4 h-4 ${currentColors.text} transition-all duration-700 ease-in-out`} />
                <span className={`text-sm font-semibold ${currentColors.text} transition-all duration-700 ease-in-out`}>
                  {stats?.win_rate.toFixed(0)}% Win Rate
                </span>
              </div>
              
              {user?.is_vip ? (
                <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-lg">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">VIP</span>
                </div>
              ) : (
                <Link 
                  href="/checkout"
                  className={`bg-gradient-to-r ${currentColors.gradient} hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-700 ease-in-out hover:scale-105 shadow-lg ${currentColors.shadow}`}
                >
                  Assinar VIP
                </Link>
              )}
              
              <button
                onClick={handleSignOut}
                className="text-slate-400 hover:text-white transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Banner com transição suave */}
      <div className={`${currentColors.bg} border-b border-white/10 transition-all duration-700 ease-in-out`}>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${currentColors.hover} transition-all duration-700 ease-in-out`}>
              <div className="flex items-center gap-2 mb-2">
                <Target className={`w-5 h-5 ${currentColors.text} transition-all duration-700 ease-in-out`} />
                <span className="text-xs text-slate-400 uppercase">Win Rate</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.win_rate.toFixed(0)}%</p>
            </div>
            
            <div className={`bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${currentColors.hover} transition-all duration-700 ease-in-out`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className={`w-5 h-5 ${currentColors.text} transition-all duration-700 ease-in-out`} />
                <span className="text-xs text-slate-400 uppercase">Total Tips</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.total_tips}</p>
            </div>
            
            <div className={`bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${currentColors.hover} transition-all duration-700 ease-in-out`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className={`w-5 h-5 ${currentColors.text} transition-all duration-700 ease-in-out`} />
                <span className="text-xs text-slate-400 uppercase">Greens</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.green_tips}</p>
            </div>
            
            <div className={`bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${currentColors.hover} transition-all duration-700 ease-in-out`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-5 h-5 ${currentColors.text} transition-all duration-700 ease-in-out`} />
                <span className="text-xs text-slate-400 uppercase">ROI</span>
              </div>
              <p className={`text-2xl font-bold ${currentColors.text} transition-all duration-700 ease-in-out`}>{stats?.roi}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Sport Selector com transição suave */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSelectedSport("nba")}
            className={`flex-1 md:flex-none md:px-8 py-4 rounded-xl font-semibold transition-all duration-700 ease-in-out ${
              selectedSport === "nba"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-white/10"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" />
              <span>NBA</span>
            </div>
          </button>
          
          <button
            onClick={() => setSelectedSport("futebol")}
            className={`flex-1 md:flex-none md:px-8 py-4 rounded-xl font-semibold transition-all duration-700 ease-in-out ${
              selectedSport === "futebol"
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 scale-105"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-white/10"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              <span>Futebol</span>
            </div>
          </button>
        </div>

        {/* Tips Gratuitas */}
        {freeTips.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className={`w-6 h-6 ${currentColors.text} transition-all duration-700 ease-in-out`} />
              <h2 className="text-2xl font-bold text-white">Tips Gratuitas</h2>
              <span className={`${currentColors.bg} ${currentColors.text} px-3 py-1 rounded-full text-sm font-semibold transition-all duration-700 ease-in-out`}>
                {freeTips.length} disponíveis
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {freeTips.map((tip) => (
                <TipCard key={tip.id} tip={tip} getStatusColor={getStatusColor} getStatusText={getStatusText} colors={currentColors} />
              ))}
            </div>
          </div>
        )}

        {/* Tips VIP */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Tips VIP Premium</h2>
            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
              {vipTips.length} exclusivas
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {vipTips.map((tip) => (
              <VipTipCard 
                key={tip.id} 
                tip={tip} 
                getStatusColor={getStatusColor} 
                getStatusText={getStatusText}
                isVipUser={user?.is_vip || false}
                colors={currentColors}
              />
            ))}
          </div>
        </div>

        {/* CTA Section com transição suave */}
        {!user?.is_vip && (
          <div className={`mt-12 ${currentColors.bg} border border-white/10 rounded-2xl p-8 text-center transition-all duration-700 ease-in-out`}>
            <div className="max-w-2xl mx-auto">
              <div className={`inline-flex items-center gap-2 ${currentColors.bg} border ${currentColors.border} px-4 py-2 rounded-full mb-4 transition-all duration-700 ease-in-out`}>
                <Star className={`w-4 h-4 ${currentColors.text} transition-all duration-700 ease-in-out`} />
                <span className={`text-sm font-semibold ${currentColors.text} transition-all duration-700 ease-in-out`}>Plano VIP</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Acesso a Tips Premium
              </h2>
              <p className="text-slate-400 mb-6 text-lg">
                Receba análises detalhadas, estatísticas avançadas e tips exclusivos com até 92% de assertividade
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/vip"
                  className={`bg-gradient-to-r ${currentColors.gradient} hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-700 ease-in-out hover:scale-105 shadow-xl ${currentColors.shadow} flex items-center gap-2`}
                >
                  <Users className="w-5 h-5" />
                  Começar Agora
                </Link>
                <Link 
                  href="/vip"
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold border border-white/10 transition-all duration-300"
                >
                  Saber Mais
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer com transição suave */}
      <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl mt-16 transition-all duration-700 ease-in-out">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${currentColors.gradient} p-2 rounded-xl transition-all duration-700 ease-in-out`}>
                <Trophy className="w-5 h-5 text-white" />
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

function TipCard({ 
  tip, 
  getStatusColor, 
  getStatusText,
  colors
}: { 
  tip: Tip; 
  getStatusColor: (status: Tip['status']) => string;
  getStatusText: (status: Tip['status']) => string;
  colors: any;
}) {
  const generateBet365Url = (tip: Tip) => {
    const baseUrl = "https://www.bet365.com";
    const betInfo = encodeURIComponent(`${tip.match} - ${tip.tip}`);
    return `${baseUrl}/#/AC/B1/C1/D1002/E${Math.random().toString(36).substring(7)}/F2/`;
  };

  return (
    <div className={`bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${colors.hover} transition-all duration-700 ease-in-out hover:shadow-xl hover:shadow-${colors.text}/10 group`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text} transition-all duration-700 ease-in-out`}>
            {tip.sport === "nba" ? (
              <Trophy className="w-5 h-5" />
            ) : (
              <Target className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">{tip.league}</p>
            <h3 className="text-lg font-bold text-white">{tip.match}</h3>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-lg border text-xs font-bold ${getStatusColor(tip.status)}`}>
          {getStatusText(tip.status)}
        </div>
      </div>

      {/* Time & Date */}
      <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{tip.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{tip.time}</span>
        </div>
      </div>

      {/* Tip Info */}
      <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">APOSTA</p>
            <p className="text-xl font-bold text-white">{tip.tip}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">ODD</p>
            <p className={`text-2xl font-bold ${colors.text} transition-all duration-700 ease-in-out`}>{tip.odds.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Confidence Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Confiança</span>
            <span className={`text-xs font-bold ${colors.text} transition-all duration-700 ease-in-out`}>{tip.confidence}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-700 ease-in-out`}
              style={{ width: `${tip.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-slate-800/30 rounded-lg p-3 mb-4 border border-white/5">
        <div className="flex items-start gap-2">
          <Shield className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0 transition-all duration-700 ease-in-out`} />
          <p className="text-sm text-slate-300 leading-relaxed">{tip.analysis}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className={`flex-1 bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white py-3 rounded-lg font-semibold transition-all duration-700 ease-in-out group-hover:shadow-lg ${colors.shadow} flex items-center justify-center gap-2`}>
          <Zap className="w-4 h-4" />
          Ver Análise
        </button>
        
        <a
          href={generateBet365Url(tip)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#1e7e34] hover:bg-[#155d27] text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-[#28a745]/30"
        >
          <ExternalLink className="w-4 h-4" />
          Apostar Bet365
        </a>
      </div>
    </div>
  );
}

function VipTipCard({ 
  tip, 
  getStatusColor, 
  getStatusText,
  isVipUser,
  colors
}: { 
  tip: Tip; 
  getStatusColor: (status: Tip['status']) => string;
  getStatusText: (status: Tip['status']) => string;
  isVipUser: boolean;
  colors: any;
}) {
  const generateBet365Url = (tip: Tip) => {
    const baseUrl = "https://www.bet365.com";
    const betInfo = encodeURIComponent(`${tip.match} - ${tip.tip}`);
    return `${baseUrl}/#/AC/B1/C1/D1002/E${Math.random().toString(36).substring(7)}/F2/`;
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 backdrop-blur-sm border-2 border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 group relative overflow-hidden">
      {/* VIP Badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10">
        <Lock className="w-3 h-3" />
        VIP
      </div>

      {/* Blur Overlay ULTRA INTENSO para usuários não VIP */}
      {!isVipUser && (
        <div className="absolute inset-0 backdrop-blur-[40px] bg-slate-900/95 rounded-2xl z-20 flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Conteúdo VIP</h3>
            <p className="text-slate-300 mb-6">
              Desbloqueie esta tip premium e todas as outras
            </p>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30"
            >
              <Crown className="w-5 h-5" />
              Assinar VIP - R$ 99,90/mês
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4 pr-16">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text} transition-all duration-700 ease-in-out`}>
            {tip.sport === "nba" ? (
              <Trophy className="w-5 h-5" />
            ) : (
              <Target className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">{tip.league}</p>
            <h3 className="text-lg font-bold text-white">{tip.match}</h3>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-lg border text-xs font-bold ${getStatusColor(tip.status)}`}>
          {getStatusText(tip.status)}
        </div>
      </div>

      {/* Time & Date */}
      <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{tip.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{tip.time}</span>
        </div>
      </div>

      {/* Tip Info */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-4 mb-4 border border-amber-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">APOSTA PREMIUM</p>
            <p className="text-xl font-bold text-white">{tip.tip}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">ODD</p>
            <p className="text-2xl font-bold text-amber-400">{tip.odds.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Confidence Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Confiança Premium</span>
            <span className="text-xs font-bold text-amber-400">{tip.confidence}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${tip.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Analysis Premium */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 mb-4 border border-amber-500/20">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-amber-400 font-semibold mb-2">ANÁLISE PREMIUM</p>
            <p className="text-sm text-slate-300 leading-relaxed">{tip.analysis}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href="/checkout"
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/30 flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Ver Completa
        </Link>
        
        {isVipUser && (
          <a
            href={generateBet365Url(tip)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#1e7e34] hover:bg-[#155d27] text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-[#28a745]/30"
          >
            <ExternalLink className="w-4 h-4" />
            Apostar Bet365
          </a>
        )}
      </div>
    </div>
  );
}
