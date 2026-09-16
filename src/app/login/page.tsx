'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-[#faf9f6]">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 space-y-7 shadow-xs">
        
        {/* LOGO & TITLE */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-amber-800" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Espace Administration
          </h1>
          <p className="text-xs text-stone-500 font-light">
            Connectez-vous pour accéder au panneau de gestion de la boutique.
          </p>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Adresse Email Admin
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@soniasperfumery.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Mot de Passe
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs tracking-wider uppercase shadow-xs disabled:opacity-50 transition-colors"
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

        <div className="text-center pt-3 border-t border-stone-100">
          <Link href="/" className="text-xs text-stone-500 hover:text-amber-800 transition-colors">
            ← Retour à l&apos;accueil du site
          </Link>
        </div>

      </div>
    </div>
  );
}
