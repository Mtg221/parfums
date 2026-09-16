'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  FolderTree, 
  X,
  Sparkles
} from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoriesService';
import { uploadToCloudinary, DEFAULT_CATEGORY_IMAGES } from '@/lib/cloudinary';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // File Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // UI Alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      setError('Impossible de charger les univers et catégories.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImageUrl(cat.imageUrl || '');
    setImageFile(null);
    setImagePreview(cat.imageUrl || null);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Le nom de l\'univers / catégorie est obligatoire.');
      return;
    }

    setSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        setUploading(true);
        finalImageUrl = await uploadToCloudinary(imageFile);
        setUploading(false);
      } else if (!finalImageUrl) {
        finalImageUrl = DEFAULT_CATEGORY_IMAGES[name.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          imageUrl: finalImageUrl,
        });
        setSuccess('Univers / Catégorie modifié(e) avec succès.');
      } else {
        await createCategory({
          name: name.trim(),
          description: description.trim(),
          imageUrl: finalImageUrl,
        });
        setSuccess('Nouvel univers / catégorie ajouté(e) avec succès.');
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error('Category submit error:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement de l\'univers.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'univers "${catName}" ?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await deleteCategory(id);
      setSuccess(`L'univers "${catName}" a été supprimé avec succès.`);
      fetchCategories();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Impossible de supprimer cet univers.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center space-x-3">
            <FolderTree className="w-7 h-7 text-[#B76E79]" />
            <span>Gestion de Nos Univers & Catégories</span>
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Ajoutez, modifiez ou supprimez vos univers olfactifs (Huiles parfumées, Extraits de parfum, Parfums authentiques, Coffrets...).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un univers</span>
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Attention</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-900 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* CATEGORIES GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#B76E79] animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-3">
          <p className="text-stone-700 font-medium text-sm">Aucun univers enregistré pour le moment.</p>
          <button
            onClick={handleOpenAddModal}
            className="text-xs font-semibold text-[#B76E79] hover:underline"
          >
            Créer le premier univers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const imageSrc = cat.imageUrl || DEFAULT_CATEGORY_IMAGES[cat.name.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;

            return (
              <div
                key={cat.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#D8A7B1] transition-all"
              >
                <div className="relative aspect-[16/9] w-full bg-stone-100">
                  <Image
                    src={imageSrc}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="font-serif font-bold text-lg text-white uppercase tracking-wide">
                      {cat.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs text-[10px] text-stone-200 uppercase font-semibold">
                      Univers
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <p className="text-xs text-stone-600 font-light line-clamp-3">
                    {cat.description || 'Aucune description fournie.'}
                  </p>

                  <div className="pt-3 border-t border-stone-100 flex justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                      title="Modifier l'univers"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                      title="Supprimer l'univers"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {editingCategory ? 'Modifier l\'univers' : 'Ajouter un nouvel univers'}
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
                  Nom de l&apos;univers / catégorie <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Huiles parfumées, Coffrets, Extraits de parfum..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Description de l&apos;univers
                </label>
                <textarea
                  rows={3}
                  placeholder="Courte présentation de cet univers olfactif..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              {/* CLOUDINARY UPLOAD SECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Image d&apos;illustration (Cloudinary)
                </label>
                
                {imagePreview && (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                    <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold transition-colors">
                    <Upload className="w-4 h-4 text-[#B76E79]" />
                    <span>{imageFile ? imageFile.name : 'Sélectionner une image (JPG, PNG, WEBP)'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-1">
                  <label className="block text-[10px] text-stone-500 uppercase">Ou saisir une URL d&apos;image externe :</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 mt-1 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
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
                  disabled={submitting || uploading}
                  className="px-6 py-2.5 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  {submitting || uploading ? (
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
