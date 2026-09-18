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

export const PHOTO_LOCATIONS = [
  { key: 'hero_banner', label: 'Bannière Principale (Accueil Hero Background)' },
  { key: 'hero_flacon', label: 'Flacon Mis en Avant (Hero Droite)' },
  { key: 'univers_huiles', label: 'Image Univers - Huiles Parfumées' },
  { key: 'univers_extraits', label: 'Image Univers - Extraits de Parfum' },
  { key: 'univers_authentiques', label: 'Image Univers - Parfums Authentiques' },
  { key: 'banner_coffrets', label: 'Bannière Section Coffrets' },
  { key: 'banner_contact', label: 'Bannière Section Contact' },
];

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<SitePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocationKey, setSelectedLocationKey] = useState(PHOTO_LOCATIONS[0].key);
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
    setSelectedLocationKey(PHOTO_LOCATIONS[0].key);
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

    if (!imageFile && !url.trim()) {
      setError('Veuillez téléverser une photo ou saisir une URL d\'image.');
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

      const selectedLoc = PHOTO_LOCATIONS.find(l => l.key === selectedLocationKey) || PHOTO_LOCATIONS[0];
      await saveSitePhoto(selectedLoc.key, selectedLoc.label, finalUrl);

      setSuccess(`Photo pour "${selectedLoc.label}" enregistrée avec succès !`);
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
            Choisissez l&apos;emplacement du site (Hero, Univers, Bannières) et téléversez vos propres photos.
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

      {/* PHOTOS LIST BY LOCATION */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#B76E79] animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHOTO_LOCATIONS.map((loc) => {
              const activePhoto = photos.find(p => p.key === loc.key || p.label === loc.label);

              return (
                <div
                  key={loc.key}
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#D8A7B1] transition-all"
                >
                  <div className="p-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-stone-900 truncate">
                      {loc.label}
                    </span>
                    {activePhoto ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        En ligne
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Non configuré
                      </span>
                    )}
                  </div>

                  <div className="relative aspect-[16/9] w-full bg-stone-100 flex items-center justify-center">
                    {activePhoto ? (
                      <Image
                        src={activePhoto.url}
                        alt={loc.label}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-center p-4 space-y-2">
                        <ImageIcon className="w-8 h-8 text-stone-300 mx-auto" />
                        <p className="text-[11px] text-stone-400 font-light">Aucune photo téléversée</p>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-white flex justify-between items-center border-t border-stone-100">
                    {activePhoto ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedLocationKey(loc.key);
                            handleOpenModal();
                          }}
                          className="text-xs font-bold text-[#B76E79] hover:underline"
                        >
                          Remplacer la photo
                        </button>
                        <button
                          onClick={() => handleDelete(activePhoto.id, activePhoto.label)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedLocationKey(loc.key);
                          handleOpenModal();
                        }}
                        className="w-full py-2 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider text-center"
                      >
                        + Uploader pour cet emplacement
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Téléverser une Photo du Site
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* DROPDOWN EM PLACEMENT */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Choisir l&apos;emplacement exact sur le site <span className="text-red-600">*</span>
                </label>
                <select
                  value={selectedLocationKey}
                  onChange={(e) => setSelectedLocationKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-bold focus:outline-none focus:border-[#B76E79]"
                >
                  {PHOTO_LOCATIONS.map((loc) => (
                    <option key={loc.key} value={loc.key}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* FILE SELECTOR */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Fichier photo à téléverser
                </label>
                
                {imagePreview && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                    <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                  </div>
                )}

                <label className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#B76E79]" />
                  <span>{imageFile ? imageFile.name : 'Choisir votre fichier photo (JPG, PNG, WEBP)'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <div className="pt-1">
                  <label className="block text-[10px] text-stone-500 uppercase">Ou saisir l&apos;URL externe de l&apos;image :</label>
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
                    <span>Valider et Enregistrer</span>
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
