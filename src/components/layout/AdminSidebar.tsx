'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Sparkles, 
  Menu, 
  X,
  Database,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { seedInitialData } from '@/services/seedService';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Catégories', icon: FolderTree },
    { href: '/admin/parfums', label: 'Parfums', icon: Package },
    { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSeed = async () => {
    if (!window.confirm('Voulez-vous générer les données de démonstration (Homme, Femme, Unisexe, Oriental, Sauvage, Bleu...)?')) {
      return;
    }
    setSeeding(true);
    setSeedMessage(null);
    try {
      await seedInitialData();
      setSeedMessage('Données de démo créées avec succès ! Rechargez les pages.');
      window.location.reload();
    } catch (err: any) {
      console.error('Seed error:', err);
      setSeedMessage('Erreur lors de la génération : ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      {/* MOBILE TOP BAR FOR ADMIN */}
      <div className="lg:hidden bg-neutral-950 border-b border-amber-900/20 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <span className="font-serif font-bold text-amber-100 text-sm tracking-wider uppercase">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-neutral-300 hover:bg-neutral-900"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* SIDEBAR OVERLAY FOR MOBILE */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-neutral-950 border-r border-amber-900/20 flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          
          {/* HEADER LOGO */}
          <div className="space-y-1">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </span>
              <span className="text-lg font-serif font-bold text-amber-100 tracking-wider uppercase">
                {process.env.NEXT_PUBLIC_SITE_NAME || 'AURA PARFUMS'}
              </span>
            </Link>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold pl-10">
              Panneau d&apos;administration
            </p>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-md'
                      : 'text-neutral-400 hover:text-amber-100 hover:bg-neutral-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM UTILITIES: USER INFO, SEED & LOGOUT */}
        <div className="space-y-4 pt-6 border-t border-neutral-900">
          
          {/* USER EMAIL */}
          {user && (
            <div className="px-3 py-2 rounded-xl bg-neutral-900/60 border border-neutral-800/60">
              <p className="text-[10px] uppercase text-neutral-500 font-semibold">Connecté en tant que</p>
              <p className="text-xs text-amber-200 font-mono truncate">{user.email || 'Admin'}</p>
            </div>
          )}

          {/* SEED DATA BUTTON */}
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 border border-neutral-800 text-xs font-medium transition-colors"
            title="Injecter des catégories et parfums de test"
          >
            {seeding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Database className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{seeding ? 'Génération...' : 'Injecter démo test'}</span>
          </button>
          
          {seedMessage && (
            <p className="text-[10px] text-amber-300 text-center leading-tight">{seedMessage}</p>
          )}

          {/* PUBLIC SITE LINK */}
          <Link
            href="/"
            className="block text-center text-xs text-neutral-500 hover:text-amber-400 transition-colors py-1"
          >
            ← Voir le site public
          </Link>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-900/30 text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>

        </div>
      </aside>
    </>
  );
};
