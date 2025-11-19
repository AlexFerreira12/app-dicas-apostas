"use client";

import { 
  Trophy, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Sparkles,
  Lock,
  Crown,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function VipPage() {
  const benefits = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Tips Premium Ilimitadas",
      description: "Acesso completo a todas as análises VIP sem limites"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "92% de Assertividade",
      description: "Nossas tips VIP têm histórico comprovado de alta taxa de acerto"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Análises Detalhadas",
      description: "Estatísticas avançadas e insights profundos de cada partida"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Notificações em Tempo Real",
      description: "Receba alertas instantâneos das melhores oportunidades"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Suporte Prioritário",
      description: "Atendimento exclusivo e suporte dedicado 24/7"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "ROI Comprovado",
      description: "Histórico transparente com retorno sobre investimento positivo"
    }
  ];

  const testimonials = [
    {
      name: "Carlos M.",
      role: "Membro VIP há 6 meses",
      text: "Melhor investimento que fiz! Já recuperei o valor da assinatura na primeira semana.",
      rating: 5
    },
    {
      name: "Ana P.",
      role: "Membro VIP há 3 meses",
      text: "As análises são incríveis. Finalmente encontrei um serviço sério e profissional.",
      rating: 5
    },
    {
      name: "Roberto S.",
      role: "Membro VIP há 1 ano",
      text: "Acompanho há 1 ano e a consistência é impressionante. Recomendo demais!",
      rating: 5
    }
  ];

  const stats = [
    { label: "Taxa de Acerto", value: "92%", icon: <Target className="w-5 h-5" /> },
    { label: "Membros VIP", value: "2.500+", icon: <Users className="w-5 h-5" /> },
    { label: "Tips Enviadas", value: "15.000+", icon: <Trophy className="w-5 h-5" /> },
    { label: "ROI Médio", value: "+47%", icon: <TrendingUp className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  SmartHub
                </h1>
                <p className="text-xs text-slate-400">Tips Profissionais</p>
              </div>
            </Link>
            
            <Link 
              href="/"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full mb-6">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">Plano VIP Premium</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Transforme Suas Apostas em{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Lucro Consistente
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 leading-relaxed">
            Junte-se a mais de 2.500 apostadores que já estão lucrando com nossas tips premium. 
            Análises profissionais, estatísticas avançadas e suporte dedicado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/checkout"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 flex items-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Assinar Agora - R$ 99,90/mês
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2 mb-2 text-amber-400">
                  {stat.icon}
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Por Que Escolher o Plano VIP?
          </h2>
          <p className="text-slate-400 text-lg">
            Benefícios exclusivos que fazem a diferença nos seus resultados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-14 h-14 rounded-xl flex items-center justify-center text-amber-400 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Gratuito vs VIP Premium
            </h2>
            <p className="text-slate-400 text-lg">
              Veja a diferença entre os planos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Gratuito</h3>
                <p className="text-4xl font-bold text-slate-400">R$ 0</p>
                <p className="text-sm text-slate-500">por mês</p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">5 tips gratuitas por mercado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Análises básicas</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <Lock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-500">Tips premium bloqueadas</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <Lock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-500">Sem estatísticas avançadas</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <Lock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-500">Sem notificações em tempo real</span>
                </li>
              </ul>
            </div>

            {/* VIP Plan */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm border-2 border-amber-500/30 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                RECOMENDADO
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">VIP Premium</h3>
                <p className="text-4xl font-bold text-amber-400">R$ 99,90</p>
                <p className="text-sm text-slate-400">por mês</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-semibold">Tips premium ilimitadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-semibold">Análises detalhadas e profissionais</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-semibold">92% de taxa de acerto</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-semibold">Estatísticas avançadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-semibold">Notificações em tempo real</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-semibold">Suporte prioritário 24/7</span>
                </li>
              </ul>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Assinar Agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            O Que Nossos Membros VIP Dizem
          </h2>
          <p className="text-slate-400 text-lg">
            Depoimentos reais de quem já está lucrando
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">"{testimonial.text}"</p>
              <div>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-slate-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <Crown className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto Para Começar a Lucrar?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Junte-se aos milhares de apostadores que já transformaram suas apostas em lucro consistente. 
            Cancele quando quiser, sem compromisso.
          </p>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30"
          >
            <Crown className="w-5 h-5" />
            Assinar VIP Premium - R$ 99,90/mês
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            Pagamento seguro • Cancele quando quiser • Suporte 24/7
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 rounded-xl">
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
