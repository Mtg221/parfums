'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Package, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Layers,
  Sparkles,
  Star,
  Building2,
  Image as ImageIcon,
  Upload,
  Gift,
  Diamond,
  Droplet
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/productsService';
import { getBrands, Brand } from '@/services/brandsService';
import { Product, ProductFormat } from '@/types';
import { formatPrice } from '@/lib/whatsapp';
import { uploadToCloudinary } from '@/lib/cloudinary';

function AdminParfumsContent() {
  const searchParams = useSearchParams();
  const activeTypeFilter = searchParams.get('type') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [allowCustomVolume, setAllowCustomVolume] = useState<boolean>(true);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);
  
  // Specific Category Flags & Prices
  const [categoryType, setCategoryType] = useState<'huiles-parfumees' | 'extraits-parfums' | 'parfums-authentiques' | 'coffrets'>('huiles-parfumees');
  const [priceHuile, setPriceHuile] = useState<number>(5000);
  const [priceExtrait, setPriceExtrait] = useState<number>(8000);
  const [priceAuthentic, setPriceAuthentic] = useState<number>(25000);
  const [priceCoffret, setPriceCoffret] = useState<number>(35000);
  const [coffretContentString, setCoffretContentString] = useState<string>('');

  const [formats, setFormats] = useState<ProductFormat[]>([
    { id: 'fmt-1', sizeMl: 5, price: 3000, stock: 50 },
    { id: 'fmt-2', sizeMl: 16, price: 8000, stock: 30 },
  ]);

  // UI Alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodData, brandData] = await Promise.all([
        getProducts(),
        getBrands(),
      ]);
      setProducts(prodData);
      setBrands(brandData);
    } catch (err: any) {
      setError('Impossible de charger les données depuis la base de données.');
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

  const handleOpenAddModal = (presetType?: string) => {
    const defaultCategory = (presetType || activeTypeFilter) === 'all' ? 'huiles-parfumees' : (presetType || activeTypeFilter);
    setEditingProduct(null);
    setName('');
    setBrand(brands.length > 0 ? brands[0].name : '');
    setDescription('');
    setImageUrl('');
    setImageFile(null);
    setImagePreview(null);
    setUploading(false);
    setAllowCustomVolume(true);
    setIsBestSeller(false);
    setCategoryType(defaultCategory as any);
    setPriceHuile(5000);
    setPriceExtrait(8000);
    setPriceAuthentic(25000);
    setPriceCoffret(35000);
    setCoffretContentString('');
    setFormats([
      { id: 'fmt-' + Date.now() + '-1', sizeMl: 5, price: 5000, stock: 50 },
      { id: 'fmt-' + Date.now() + '-2', sizeMl: 16, price: 10000, stock: 40 },
      { id: 'fmt-' + Date.now() + '-3', sizeMl: 20, price: 12000, stock: 30 },
      { id: 'fmt-' + Date.now() + '-4', sizeMl: 100, price: 25000, stock: 20 },
    ]);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setBrand(prod.brand || '');
    setDescription(prod.description || '');
    setImageUrl(prod.imageUrl || '');
    setImageFile(null);
    setImagePreview(prod.imageUrl || null);
    setUploading(false);
    setAllowCustomVolume(prod.allowCustomVolume ?? true);
    setIsBestSeller(prod.isBestSeller ?? false);
    
    if (prod.isCoffret) {
      setCategoryType('coffrets');
    } else if (prod.isAuthentic) {
      setCategoryType('parfums-authentiques');
    } else if (prod.priceExtrait && !prod.priceHuile) {
      setCategoryType('extraits-parfums');
    } else {
      setCategoryType('huiles-parfumees');
    }

    setPriceHuile(prod.priceHuile || 5000);
    setPriceExtrait(prod.priceExtrait || 8000);
    setPriceAuthentic(prod.priceAuthentic || 25000);
    setPriceCoffret(prod.priceCoffret || 35000);
    setCoffretContentString(prod.coffretContent ? prod.coffretContent.join(', ') : '');
    setFormats(prod.formats || []);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const addFormatField = () => {
    setFormats((prev) => [
      ...prev,
      { id: 'fmt-' + Date.now(), sizeMl: 50, price: 15000, stock: 10 },
    ]);
  };

  const removeFormatField = (id: string) => {
    setFormats((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFormatField = (id: string, field: keyof ProductFormat, value: number) => {
    setFormats((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Le nom de l\'article est obligatoire.');
      return;
    }

    if ((categoryType === 'huiles-parfumees' || categoryType === 'extraits-parfums') && !brand.trim()) {
      setError('Veuillez sélectionner ou indiquer une Maison de Parfum pour cette catégorie.');
      return;
    }

    setSubmitting(true);

    try {
      let finalImageUrl = imageUrl.trim();

      if (imageFile) {
        setUploading(true);
        try {
          finalImageUrl = await uploadToCloudinary(imageFile);
        } catch (uploadErr: any) {
          setError(uploadErr.message || "Échec de l'envoi de l'image.");
          setSubmitting(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      const coffretArr = coffretContentString
        ? coffretContentString.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const rawPayload: Record<string, any> = {
        name: name.trim(),
        brand: brand.trim(),
        description: description.trim(),
        imageUrl: finalImageUrl,
        formats: formats.length > 0 ? formats : [{ id: 'default', sizeMl: 100, price: priceAuthentic || priceCoffret || 25000, stock: 10 }],
        allowCustomVolume,
        isBestSeller,
        priceHuile: categoryType === 'huiles-parfumees' ? priceHuile : null,
        priceExtrait: categoryType === 'extraits-parfums' ? priceExtrait : null,
        priceAuthentic: categoryType === 'parfums-authentiques' ? priceAuthentic : null,
        priceCoffret: categoryType === 'coffrets' ? priceCoffret : null,
        isAuthentic: categoryType === 'parfums-authentiques',
        isCoffret: categoryType === 'coffrets',
        coffretContent: coffretArr,
        categoryName: categoryType === 'huiles-parfumees' ? 'Huiles parfumées' :
                      categoryType === 'extraits-parfums' ? 'Extraits de parfum' :
                      categoryType === 'parfums-authentiques' ? 'Parfums authentiques' : 'Coffret',
      };

      // Remove undefined values since Firestore rejects undefined
      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(([_, v]) => v !== undefined)
      );

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload as any);
        setSuccess('Article mis à jour avec succès.');
      } else {
        await createProduct(payload as any);
        setSuccess('Article créé avec succès.');
      }

      setIsModalOpen(false);
      fetchInitialData();
    } catch (err: any) {
      console.error('Product submit error:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${prodName}" ?`)) {
      return;
    }

    try {
      await deleteProduct(id);
      setSuccess(`L'article "${prodName}" a été supprimé.`);
      fetchInitialData();
    } catch (err: any) {
      setError('Impossible de supprimer cet article.');
    }
  };

  // Filter List according to activeTypeFilter
  const filteredProducts = products.filter((p) => {
    if (activeTypeFilter === 'huiles-parfumees') {
      return !p.isCoffret && !p.isAuthentic && (p.priceHuile || (!p.priceExtrait && !p.isAuthentic && !p.isCoffret));
    }
    if (activeTypeFilter === 'extraits-parfums') {
      return !p.isCoffret && !p.isAuthentic && p.priceExtrait;
    }
    if (activeTypeFilter === 'parfums-authentiques') {
      return p.isAuthentic || p.priceAuthentic;
    }
    if (activeTypeFilter === 'coffrets') {
      return p.isCoffret || p.priceCoffret;
    }
    return true;
  });

  const sectionTitle = activeTypeFilter === 'huiles-parfumees' ? 'Section Huiles Parfumées' :
                       activeTypeFilter === 'extraits-parfums' ? 'Section Extraits de Parfum' :
                       activeTypeFilter === 'parfums-authentiques' ? 'Section Parfums Authentiques' :
                       activeTypeFilter === 'coffrets' ? 'Section Coffrets Cadeaux' : 'Catalogue Général';

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center space-x-3">
            <Package className="w-7 h-7 text-[#B76E79]" />
            <span>{sectionTitle}</span>
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Gérez vos produits réels enregistrés en base de données.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un article</span>
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

      {/* PRODUCTS LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#B76E79] animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-3 p-8">
          <p className="text-stone-700 font-medium text-sm">Aucun article réel enregistré dans cette section pour le moment.</p>
          <button
            onClick={() => handleOpenAddModal()}
            className="text-xs font-semibold text-[#B76E79] hover:underline block mx-auto"
          >
            + Ajouter le premier article ici
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-stone-200 rounded-xl p-6 space-y-5 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    {prod.brand && (
                      <span className="text-[10px] uppercase tracking-widest text-[#B76E79] font-bold block">
                        Maison : {prod.brand}
                      </span>
                    )}

                    <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">{prod.name}</h2>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {prod.isCoffret && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-300 text-[10px] text-purple-900 font-semibold">
                          <Gift className="w-2.5 h-2.5 text-purple-700" />
                          <span>Coffret</span>
                        </span>
                      )}
                      {prod.isAuthentic && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] text-emerald-900 font-semibold">
                          <Diamond className="w-2.5 h-2.5 text-emerald-700" />
                          <span>Authentique</span>
                        </span>
                      )}
                      {prod.isBestSeller && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-[10px] text-amber-900 font-semibold">
                          <Star className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                          <span>Best-Seller</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id, prod.name)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-2 pt-1">
                  {prod.description || 'Aucune description.'}
                </p>

                {prod.isCoffret && prod.coffretContent && prod.coffretContent.length > 0 && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-stone-800 block text-[10px] uppercase">Contenu du coffret :</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-stone-600 text-[11px]">
                      {prod.coffretContent.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* FORMATS / PRICING DISPLAY */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500 font-semibold">Prix enregistré :</span>
                  <span className="font-bold text-[#B76E79]">
                    {formatPrice(prod.priceHuile || prod.priceExtrait || prod.priceAuthentic || prod.priceCoffret || prod.formats?.[0]?.price || 0)}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl my-8">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {editingProduct ? 'Modifier l\'article' : 'Ajouter un nouvel article'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-800 text-xs">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {/* SECTION TYPE SELECTOR */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Section / Catégorie de destination <span className="text-red-600">*</span>
                </label>
                <select
                  value={categoryType}
                  onChange={(e: any) => setCategoryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-bold uppercase focus:outline-none focus:border-[#B76E79]"
                >
                  <option value="huiles-parfumees">Huiles Parfumées (Avec Maison)</option>
                  <option value="extraits-parfums">Extraits de Parfum (Avec Maison)</option>
                  <option value="parfums-authentiques">Parfums Authentiques (Flacon d&apos;origine)</option>
                  <option value="coffrets">Coffret Cadeau (Spécifier le contenu)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Nom de l&apos;article <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bleu de Chanel / Coffret Élégance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                {/* SELECT MAISON DE PARFUM (SI HUILE OU EXTRAIT) */}
                {(categoryType === 'huiles-parfumees' || categoryType === 'extraits-parfums') ? (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-[#B76E79]" />
                      <span>Maison de Parfum (Marque) <span className="text-red-600">*</span></span>
                    </label>
                    {brands.length > 0 ? (
                      <select
                        required
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-bold uppercase focus:outline-none focus:border-[#B76E79]"
                      >
                        <option value="">-- Choisir une Maison --</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        placeholder="Ex: DIOR, CHANEL, TOM FORD"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-bold uppercase focus:outline-none focus:border-[#B76E79]"
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Marque / Fabricant (Optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Chanel / Collection Privée"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                )}
              </div>

              {/* SPECIFIC PRICING & FORMAT VOLUMES (5ml, 16ml, 20ml, 100ml & CUSTOM) */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-stone-800">Contenants et Prix selon vos besoins</h4>
                    <p className="text-[10px] text-stone-500 font-light">
                      Définissez les contenants (ex: 5ml, 16ml, 20ml, 100ml) et ajoutez autant de volumes personnalisés que souhaité.
                    </p>
                  </div>
                  {(categoryType === 'huiles-parfumees' || categoryType === 'extraits-parfums') && (
                    <button
                      type="button"
                      onClick={addFormatField}
                      className="px-3 py-1.5 rounded bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-[10px] uppercase tracking-wider flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ajouter un contenant</span>
                    </button>
                  )}
                </div>

                {(categoryType === 'huiles-parfumees' || categoryType === 'extraits-parfums') ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-[10px] font-bold uppercase text-stone-500 px-1">
                      <span>Volume (ml)</span>
                      <span>Prix (FCFA)</span>
                      <span>Stock disponible</span>
                      <span>Action</span>
                    </div>

                    {formats.map((fmt) => (
                      <div key={fmt.id} className="grid grid-cols-4 gap-2 items-center bg-white p-2 border border-stone-200 rounded-lg shadow-2xs">
                        <input
                          type="number"
                          min="1"
                          placeholder="Volume ml"
                          value={fmt.sizeMl}
                          onChange={(e) => updateFormatField(fmt.id, 'sizeMl', parseInt(e.target.value) || 0)}
                          className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs font-bold text-stone-900"
                        />
                        <input
                          type="number"
                          min="0"
                          placeholder="Prix FCFA"
                          value={fmt.price}
                          onChange={(e) => updateFormatField(fmt.id, 'price', parseInt(e.target.value) || 0)}
                          className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs font-bold text-[#B76E79]"
                        />
                        <input
                          type="number"
                          min="0"
                          placeholder="Stock"
                          value={fmt.stock}
                          onChange={(e) => updateFormatField(fmt.id, 'stock', parseInt(e.target.value) || 0)}
                          className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900"
                        />
                        <button
                          type="button"
                          onClick={() => removeFormatField(fmt.id)}
                          className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 justify-self-start"
                          title="Supprimer ce contenant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : categoryType === 'parfums-authentiques' ? (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-stone-700">Prix Flacon Authentique (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={priceAuthentic}
                      onChange={(e) => setPriceAuthentic(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs font-bold text-[#B76E79]"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-stone-700">Prix du Coffret (FCFA)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={priceCoffret}
                        onChange={(e) => setPriceCoffret(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs font-bold text-[#B76E79]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-stone-700">
                        Éléments composants le coffret (séparés par des virgules) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Parfum A 50ml, Huile B 16ml, Écrin de luxe"
                        value={coffretContentString}
                        onChange={(e) => setCoffretContentString(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded text-xs text-stone-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PHOTO UPLOAD */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center space-x-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span>Photo de l&apos;article</span>
                </label>
                
                {(imagePreview || imageUrl) && (
                  <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden border border-stone-200 bg-stone-50 p-2 flex items-center justify-center">
                    <Image 
                      src={imagePreview || imageUrl} 
                      alt="Aperçu" 
                      fill 
                      className="object-contain p-1" 
                    />
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 text-stone-700 text-xs font-semibold transition-colors">
                    <Upload className="w-4 h-4 text-[#B76E79]" />
                    <span>{imageFile ? imageFile.name : 'Téléverser une photo (JPG, PNG, WEBP)'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-1">
                  <input
                    type="url"
                    placeholder="Ou saisir une URL d'image externe..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Description de l&apos;article
                </label>
                <textarea
                  rows={3}
                  placeholder="Présentation ou notes olfactives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

export default function AdminParfumsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#B76E79] animate-spin" />
      </div>
    }>
      <AdminParfumsContent />
    </Suspense>
  );
}
