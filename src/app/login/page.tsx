'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      router.push('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Identifiants incorrects ou compte non autorisé. Veuillez vérifier vos accès.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-neutral-950">
      <div className="w-full max-w-md bg-neutral-900 border border-amber-900/30 rounded-3xl p-8 space-y-8 shadow-2xl">
        
        {/* LOGO & TITLE */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-amber-100">
            Espace Administration
          </h1>
          <p className="text-xs text-neutral-400 font-light">
            Connectez-vous pour accéder au panneau de gestion de la boutique.
          </p>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="p-4 bg-red-950/60 border border-red-900/50 rounded-2xl flex items-start space-x-3 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
              Adresse Email Admin
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@auraparfums.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
              Mot de Passe
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-neutral-800">
          <Link href="/" className="text-xs text-neutral-500 hover:text-amber-400 transition-colors">
            ← Retour à l&apos;accueil du site
          </Link>
        </div>

      </div>
    </div>
  );
}
