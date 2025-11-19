'use client';

import { useState } from 'react';
import { RefreshCw, Database, TrendingUp, Calendar } from 'lucide-react';

export default function SyncDashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async (action: 'full' | 'football' | 'basketball' | 'tips') => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Erro ao sincronizar');
      }
    } catch (err) {
      setError('Erro de conexão com a API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎯 Sistema de Sincronização Automática
          </h1>
          <p className="text-gray-300 text-lg">
            Colete dados das APIs e gere tips atualizadas automaticamente
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => handleSync('full')}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Sincronização Completa
          </button>

          <button
            onClick={() => handleSync('football')}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Database className="w-5 h-5" />
            Futebol
          </button>

          <button
            onClick={() => handleSync('basketball')}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Basquete
          </button>

          <button
            onClick={() => handleSync('tips')}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Gerar Tips
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Processando sincronização...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 mb-8">
            <h3 className="text-red-300 font-semibold text-lg mb-2">❌ Erro</h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Success Result */}
        {result && result.success && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h3 className="text-green-400 font-semibold text-2xl mb-4">✅ {result.message}</h3>
            
            {result.data && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {result.data.football && (
                  <div className="bg-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-300 font-semibold mb-2">⚽ Futebol</h4>
                    <p className="text-white text-3xl font-bold">{result.data.football.count || 0}</p>
                    <p className="text-gray-300 text-sm">partidas sincronizadas</p>
                  </div>
                )}

                {result.data.basketball && (
                  <div className="bg-orange-500/20 rounded-lg p-4">
                    <h4 className="text-orange-300 font-semibold mb-2">🏀 Basquete</h4>
                    <p className="text-white text-3xl font-bold">{result.data.basketball.count || 0}</p>
                    <p className="text-gray-300 text-sm">partidas sincronizadas</p>
                  </div>
                )}

                {result.data.tips && (
                  <div className="bg-purple-500/20 rounded-lg p-4">
                    <h4 className="text-purple-300 font-semibold mb-2">🎯 Tips</h4>
                    <p className="text-white text-3xl font-bold">{result.data.tips.count || 0}</p>
                    <p className="text-gray-300 text-sm">tips geradas</p>
                  </div>
                )}
              </div>
            )}

            {result.data?.count !== undefined && (
              <div className="mt-6 bg-green-500/20 rounded-lg p-4">
                <p className="text-green-300 font-semibold text-lg">
                  Total: {result.data.count} itens processados
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instruções */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
          <h3 className="text-white font-semibold text-xl mb-4">📋 Como Funciona</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong className="text-white">1. Sincronização Completa:</strong> Busca todas as partidas do dia (futebol + basquete) e gera tips automaticamente
            </p>
            <p>
              <strong className="text-white">2. Futebol:</strong> Sincroniza apenas partidas de futebol da API
            </p>
            <p>
              <strong className="text-white">3. Basquete:</strong> Sincroniza apenas partidas de basquete da API
            </p>
            <p>
              <strong className="text-white">4. Gerar Tips:</strong> Analisa as partidas já sincronizadas e gera recomendações de apostas
            </p>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-200 text-sm">
              <strong>⚠️ Importante:</strong> Execute o script SQL em <code className="bg-black/30 px-2 py-1 rounded">supabase-schema.sql</code> no SQL Editor do Supabase antes de usar o sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
