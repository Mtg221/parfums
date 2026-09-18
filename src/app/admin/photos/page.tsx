'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Plus, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Image as ImageIcon 
} from 'lucide-react';
import { getSitePhotos, saveSitePhoto, deleteSitePhoto, SitePhoto } from '@/services/sitePhotosService';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<SitePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await getSitePhotos();
      setPhotos(data);
    } catch (err: any) {
      setError('Impossible de charger les photos du site.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenModal = () => {
    setLabel('');
    setUrl('');
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!label.trim()) {
      setError('Veuillez donner un nom ou emplacement à cette photo.');
      return;
    }

    if (!imageFile && !url.trim()) {
      setError('Veuillez téléverser une photo ou saisir une URL.');
      return;
    }

    setSubmitting(true);

    try {
      let finalUrl = url.trim();

      if (imageFile) {
        setUploading(true);
        finalUrl = await uploadToCloudinary(imageFile);
        setUploading(false);
      }

      const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
      await saveSitePhoto(key, label.trim(), finalUrl);

      setSuccess(`Photo "${label}" ajoutée avec succès !`);
      setIsModalOpen(false);
      fetchPhotos();
    } catch (err: any) {
      console.error('Save photo error:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement de la photo.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, photoLabel: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la photo "${photoLabel}" ?`)) {
      return;
    }

    try {
      await deleteSitePhoto(id);
      setSuccess(`La photo "${photoLabel}" a été supprimée.`);
      fetchPhotos();
    } catch (err: any) {
      setError('Impossible de supprimer cette photo.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center space-x-3">
            <Camera className="w-7 h-7 text-[#B76E79]" />
            <span>Gestion des Photos du Site</span>
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Ajoutez et téléversez vos propres photos pour personnaliser l&apos;interface du site (Bannières, Univers, etc.).
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une photo</span>
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

      {/* PHOTOS GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#B76E79] animate-spin" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-3 p-8">
          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto" />
          <p className="text-stone-700 font-medium text-sm">Aucune photo personnalisée enregistrée pour le moment.</p>
          <button
            onClick={handleOpenModal}
            className="text-xs font-semibold text-[#B76E79] hover:underline block mx-auto"
          >
            + Téléverser votre première photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#D8A7B1] transition-all"
            >
              <div className="relative aspect-[16/9] w-full bg-stone-100">
                <Image
                  src={p.url}
                  alt={p.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 font-serif font-bold text-sm text-white uppercase tracking-wide">
                  {p.label}
                </span>
              </div>

              <div className="p-4 flex justify-between items-center bg-stone-50 border-t border-stone-100">
                <span className="text-[10px] text-stone-500 font-mono truncate max-w-[200px]">
                  {p.url}
                </span>
                <button
                  onClick={() => handleDelete(p.id, p.label)}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                  title="Supprimer la photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Ajouter une Photo
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
                  Nom / Emplacement de la photo <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bannière d'accueil, Univers Huiles, Hero..."
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              {/* UPLOAD AREA */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Sélectionner l&apos;image
                </label>
                
                {imagePreview && (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                    <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                  </div>
                )}

                <label className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#B76E79]" />
                  <span>{imageFile ? imageFile.name : 'Choisir une photo (JPG, PNG, WEBP)'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <div className="pt-1">
                  <label className="block text-[10px] text-stone-500 uppercase">Ou coller l&apos;URL de votre image :</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3.5 py-2 mt-1 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
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
                      <span>{uploading ? 'Téléversement...' : 'Enregistrement...'}</span>
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
