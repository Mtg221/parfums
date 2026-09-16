'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Building2, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { getBrands, createBrand, deleteBrand, Brand } from '@/services/brandsService';

export default function AdminMaisonsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');

  // UI Alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (err: any) {
      setError('Impossible de charger les maisons de parfum.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setName('');
    setSubtitle('');
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Le nom de la maison de parfum est obligatoire.');
      return;
    }

    setSubmitting(true);

    try {
      await createBrand(name, subtitle);
      setSuccess(`Maison "${name.toUpperCase()}" ajoutée avec succès.`);
      setIsModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      console.error('Brand submit error:', err);
      setError('Erreur lors de l\'enregistrement de la maison de parfum.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, brandName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la maison de parfum "${brandName}" ?`)) {
      return;
    }

    try {
      await deleteBrand(id);
      setSuccess(`La maison "${brandName}" a été supprimée.`);
      fetchBrands();
    } catch (err: any) {
      setError('Impossible de supprimer cette maison.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center space-x-3">
            <Building2 className="w-7 h-7 text-[#B76E79]" />
            <span>Nos Maisons de Parfum</span>
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Gérez les grandes marques et maisons de prestige affichées dans la grille sur la page d&apos;accueil.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Maison</span>
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-900 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* BRANDS GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#B76E79] animate-spin" />
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-3">
          <p className="text-stone-700 font-medium text-sm">Aucune maison de parfum enregistrée pour le moment.</p>
          <button
            onClick={handleOpenModal}
            className="text-xs font-semibold text-[#B76E79] hover:underline"
          >
            Ajouter une première maison
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex items-center justify-between group hover:border-[#D8A7B1] transition-all"
            >
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base uppercase tracking-wider">
                  {b.name}
                </h3>
                {b.subtitle && (
                  <p className="text-[10px] text-stone-500 font-light mt-0.5">
                    {b.subtitle}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDelete(b.id, b.name)}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors opacity-80 group-hover:opacity-100"
                title="Supprimer la maison"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD BRAND MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Ajouter une Maison de Parfum
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Nom de la marque <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: DIOR, CHANEL, CREED..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-bold uppercase focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Sous-titre ou Spécialité (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Private Blend, Collections Exclusives..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold uppercase"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  {submitting ? (
                    <span className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </span>
                  ) : (
                    <span>Enregistrer</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
