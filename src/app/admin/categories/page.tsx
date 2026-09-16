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
  Image as ImageIcon 
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
      setError('Impossible de charger les catégories.');
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
      setError('Le nom de la catégorie est obligatoire.');
      return;
    }

    setSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      // 1. If user selected a new file, upload to Cloudinary (Requirement #32)
      if (imageFile) {
        setUploading(true);
        finalImageUrl = await uploadToCloudinary(imageFile);
        setUploading(false);
      } else if (!finalImageUrl) {
        // Fallback default image if none provided
        finalImageUrl = DEFAULT_CATEGORY_IMAGES[name.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;
      }

      // 2. Save or Update in Firestore
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          imageUrl: finalImageUrl,
        });
        setSuccess('Catégorie modifiée avec succès.');
      } else {
        await createCategory({
          name: name.trim(),
          description: description.trim(),
          imageUrl: finalImageUrl,
        });
        setSuccess('Catégorie ajoutée avec succès.');
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error('Category submit error:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement de la catégorie.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      // Calls service which checks if products exist (Requirement #25)
      await deleteCategory(id);
      setSuccess(`La catégorie "${name}" a été supprimée.`);
      fetchCategories();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Impossible de supprimer cette catégorie.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-900/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-amber-100 flex items-center space-x-3">
            <FolderTree className="w-7 h-7 text-amber-400" />
            <span>Gestion des Catégories</span>
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Ajoutez, modifiez ou organisez les collections d&apos;images de vos parfums.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="p-4 bg-red-950/70 border border-red-800 rounded-2xl flex items-start space-x-3 text-red-300 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Attention</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800 rounded-2xl flex items-center space-x-3 text-emerald-300 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* CATEGORIES GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-3">
          <p className="text-neutral-300 font-medium">Aucune catégorie enregistrée pour le moment.</p>
          <button
            onClick={handleOpenAddModal}
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            Créer la première catégorie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const imageSrc = cat.imageUrl || DEFAULT_CATEGORY_IMAGES[cat.name.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;

            return (
              <div
                key={cat.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] w-full bg-neutral-950">
                  <Image
                    src={imageSrc}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 font-serif font-bold text-xl text-amber-100">
                    {cat.name}
                  </span>
                </div>

                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <p className="text-xs text-neutral-400 font-light line-clamp-3">
                    {cat.description || 'Aucune description fournie.'}
                  </p>

                  <div className="pt-4 border-t border-neutral-800 flex justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-900/40 transition-colors"
                      title="Supprimer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-neutral-900 border border-amber-900/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h3 className="text-xl font-serif font-bold text-amber-100">
                {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Nom de la catégorie <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Homme, Femme, Unisexe, Oriental"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Courte description de la collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* CLOUDINARY IMAGE UPLOAD SECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Image de la catégorie (Cloudinary)
                </label>
                
                {imagePreview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                    <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
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
                  <label className="block text-[10px] text-neutral-500 uppercase">Ou saisir une URL externe direct :</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 mt-1 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold uppercase"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-bold uppercase tracking-wider shadow-md"
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
