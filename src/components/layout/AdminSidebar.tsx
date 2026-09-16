'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      {/* MOBILE TOP BAR FOR ADMIN */}
      <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-800/30 bg-white flex-shrink-0">
            <Image
              src="/logo.JPG"
              alt="SONIA’S PERFUMERY Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-serif font-bold text-stone-900 text-xs tracking-wider uppercase truncate max-w-[180px]">
            {process.env.NEXT_PUBLIC_SITE_NAME || "SONIA’S PERFUMERY"}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-stone-700 hover:bg-stone-100"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* SIDEBAR OVERLAY FOR MOBILE */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-stone-200 flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          
          {/* HEADER LOGO */}
          <div className="space-y-1">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-amber-800/30 bg-white flex-shrink-0">
                <Image
                  src="/logo.JPG"
                  alt="SONIA’S PERFUMERY Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-base font-serif font-bold text-stone-900 tracking-wider uppercase leading-tight">
                {process.env.NEXT_PUBLIC_SITE_NAME || "SONIA’S PERFUMERY"}
              </span>
            </Link>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold pl-12">
              Panneau d&apos;administration
            </p>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-800 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-800' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM UTILITIES */}
        <div className="space-y-3.5 pt-6 border-t border-stone-100">
          
          {/* USER EMAIL */}
          {user && (
            <div className="px-3 py-2 rounded-lg bg-stone-50 border border-stone-200/80">
              <p className="text-[10px] uppercase text-stone-500 font-semibold">Connecté en tant que</p>
              <p className="text-xs text-stone-900 font-mono truncate">{user.email || 'Admin'}</p>
            </div>
          )}

          {/* PUBLIC SITE LINK */}
          <Link
            href="/"
            className="block text-center text-xs text-stone-500 hover:text-stone-800 transition-colors py-1"
          >
            ← Voir le site public
          </Link>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>

        </div>
      </aside>
    </>
  );
};
