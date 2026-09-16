'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Package, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Filter,
  Layers,
  Sparkles,
  Star,
  Building2,
  Image as ImageIcon,
  FolderTree
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/productsService';
import { getCategories } from '@/services/categoriesService';
import { getBrands, Brand } from '@/services/brandsService';
import { Product, Category, ProductFormat } from '@/types';
import { formatPrice } from '@/lib/whatsapp';

export default function AdminParfumsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('DIOR');
  const [description, setDescription] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [allowCustomVolume, setAllowCustomVolume] = useState<boolean>(true);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(true);
  const [formats, setFormats] = useState<ProductFormat[]>([
    { id: 'fmt-1', sizeMl: 5, price: 3000, stock: 50 },
    { id: 'fmt-2', sizeMl: 16, price: 8000, stock: 30 },
    { id: 'fmt-3', sizeMl: 20, price: 10000, stock: 25 },
    { id: 'fmt-4', sizeMl: 100, price: 35000, stock: 10 },
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
      const [prodData, catData, brandData] = await Promise.all([
        getProducts(),
        getCategories(),
        getBrands(),
      ]);
      setProducts(prodData);
      setCategories(catData);
      setBrands(brandData);
    } catch (err: any) {
      setError('Impossible de charger les parfums, catégories ou maisons.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setBrand(brands.length > 0 ? brands[0].name : 'DIOR');
    setDescription('');
    setSelectedCategoryIds(categories.length > 0 ? [categories[0].id] : []);
    setImageUrl('');
    setAllowCustomVolume(true);
    setIsBestSeller(true);
    setFormats([
      { id: 'fmt-' + Date.now() + '-1', sizeMl: 5, price: 3000, stock: 50 },
      { id: 'fmt-' + Date.now() + '-2', sizeMl: 16, price: 8000, stock: 30 },
      { id: 'fmt-' + Date.now() + '-3', sizeMl: 20, price: 10000, stock: 25 },
      { id: 'fmt-' + Date.now() + '-4', sizeMl: 100, price: 35000, stock: 10 },
    ]);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setBrand(prod.brand || (brands.length > 0 ? brands[0].name : 'DIOR'));
    setDescription(prod.description || '');
    const currentCatIds = prod.categoryIds && prod.categoryIds.length > 0 
      ? prod.categoryIds 
      : (prod.categoryId ? [prod.categoryId] : []);
    setSelectedCategoryIds(currentCatIds);
    setImageUrl(prod.imageUrl || '');
    setAllowCustomVolume(prod.allowCustomVolume ?? true);
    setIsBestSeller(prod.isBestSeller ?? true);
    setFormats(prod.formats || []);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const addFormatField = () => {
    setFormats((prev) => [
      ...prev,
      { id: 'fmt-' + Date.now(), sizeMl: 50, price: 20000, stock: 10 },
    ]);
  };

  const removeFormatField = (id: string) => {
    if (formats.length <= 1) {
      setError('Un parfum doit avoir au moins 1 format disponible.');
      return;
    }
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
      setError('Le nom du parfum est obligatoire.');
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setError('Veuillez sélectionner au moins une catégorie / univers.');
      return;
    }
    if (formats.length === 0) {
      setError('Veuillez ajouter au moins un format (mL, Prix, Stock).');
      return;
    }

    setSubmitting(true);

    try {
      const assignedCategories = categories.filter((c) => selectedCategoryIds.includes(c.id));
      const primaryCat = assignedCategories[0];

      const payload = {
        name: name.trim(),
        brand: brand.trim(),
        description: description.trim(),
        categoryId: primaryCat ? primaryCat.id : '',
        categoryName: primaryCat ? primaryCat.name : '',
        categoryIds: selectedCategoryIds,
        categoryNames: assignedCategories.map(c => c.name),
        imageUrl: imageUrl.trim(),
        formats,
        allowCustomVolume,
        isBestSeller,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setSuccess('Parfum mis à jour avec succès.');
      } else {
        await createProduct(payload);
        setSuccess('Parfum ajouté avec succès.');
      }

      setIsModalOpen(false);
      fetchInitialData();
    } catch (err: any) {
      console.error('Product submit error:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement du parfum.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le parfum "${prodName}" ?`)) {
      return;
    }

    try {
      await deleteProduct(id);
      setSuccess(`Le parfum "${prodName}" a été supprimé.`);
      fetchInitialData();
    } catch (err: any) {
      setError('Impossible de supprimer ce parfum.');
    }
  };

  const filteredProducts = selectedCategoryFilter === 'all'
    ? products
    : products.filter((p) => p.categoryId === selectedCategoryFilter || (p.categoryIds && p.categoryIds.includes(selectedCategoryFilter)));

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center space-x-3">
            <Package className="w-7 h-7 text-[#B76E79]" />
            <span>Gestion des Parfums & Formats</span>
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Gérez vos fragrances, maisons de parfum, catégories univers (multi-univers possible), options sur-mesure et best-sellers.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un parfum</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-stone-700">
          <Filter className="w-4 h-4 text-[#B76E79]" />
          <span>Filtrer par catégorie :</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#B76E79] text-white font-bold'
                : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            Toutes ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id || (p.categoryIds && p.categoryIds.includes(c.id))).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryFilter(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategoryFilter === c.id
                    ? 'bg-[#B76E79] text-white font-bold'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
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
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-3">
          <p className="text-stone-700 font-medium text-sm">Aucun parfum trouvé pour ce filtre.</p>
          <button
            onClick={handleOpenAddModal}
            className="text-xs font-semibold text-[#B76E79] hover:underline"
          >
            Ajouter un nouveau parfum
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((prod) => {
            const assignedCatNames = prod.categoryNames && prod.categoryNames.length > 0 
              ? prod.categoryNames 
              : (prod.categoryName ? [prod.categoryName] : []);

            return (
              <div
                key={prod.id}
                className="bg-white border border-stone-200 rounded-xl p-6 space-y-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase tracking-widest text-[#B76E79] font-bold">
                          {prod.brand || 'DIOR'}
                        </span>
                      </div>

                      <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">{prod.name}</h2>

                      {/* Univers badges */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {assignedCatNames.map((catName) => (
                          <span key={catName} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
                            <FolderTree className="w-2.5 h-2.5 text-amber-700" />
                            <span>{catName}</span>
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {prod.allowCustomVolume !== false && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#FDF6F7] border border-[#D8A7B1]/50 text-[10px] text-[#B76E79] font-semibold">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Sur-mesure</span>
                          </span>
                        )}
                        {prod.isBestSeller !== false && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300/60 text-[10px] text-amber-900 font-semibold">
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
                </div>

                {/* FORMATS LIST */}
                <div className="pt-4 border-t border-stone-100 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-[#B76E79]" />
                    <span>Formats & Stocks :</span>
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {prod.formats.map((fmt) => (
                      <div
                        key={fmt.id || fmt.sizeMl}
                        className={`p-2 rounded-lg border text-xs flex flex-col justify-between space-y-0.5 ${
                          fmt.stock > 0
                            ? 'bg-stone-50 border-stone-200 text-stone-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                      >
                        <div className="flex justify-between font-bold">
                          <span>{fmt.sizeMl} mL</span>
                          <span className="text-[#B76E79]">{formatPrice(fmt.price)}</span>
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {fmt.stock > 0 ? `Stock: ${fmt.stock}` : 'Rupture'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ADD/EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl my-8">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {editingProduct ? 'Modifier le parfum' : 'Ajouter un nouveau parfum'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Nom du parfum <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sauvage Elixir / Bleu de Chanel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                {/* SELECT DROPDOWN FOR MAISON DE PARFUM */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-[#B76E79]" />
                    <span>Maison de Parfum (Marque) <span className="text-red-600">*</span></span>
                  </label>
                  <select
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-bold uppercase focus:outline-none focus:border-[#B76E79]"
                  >
                    {brands.length === 0 ? (
                      <>
                        <option value="DIOR">DIOR</option>
                        <option value="CHANEL">CHANEL</option>
                        <option value="YVES SAINT LAURENT">YVES SAINT LAURENT</option>
                        <option value="TOM FORD">TOM FORD</option>
                        <option value="GUERLAIN">GUERLAIN</option>
                      </>
                    ) : (
                      brands.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* CHECKBOXES FOR MULTI-CATEGORY ASSIGNMENT */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center space-x-1">
                  <FolderTree className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span>Catégories / Univers (Cochez un ou plusieurs univers) <span className="text-red-600">*</span></span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                  {categories.map((c) => {
                    const isChecked = selectedCategoryIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center space-x-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#FDF6F7] border-[#D8A7B1] text-stone-900 font-bold'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategoryIds([...selectedCategoryIds, c.id]);
                            } else {
                              setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== c.id));
                            }
                          }}
                          className="w-4 h-4 rounded text-[#B76E79] focus:ring-[#B76E79] border-stone-300"
                        />
                        <span className="text-xs">{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center space-x-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span>Image URL (Flacon)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Description olfactive
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes de tête, de cœur, de fond..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              {/* OPTIONS COCHABLES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FDF6F7] border border-[#D8A7B1]/40 space-y-1.5">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowCustomVolume}
                      onChange={(e) => setAllowCustomVolume(e.target.checked)}
                      className="w-4 h-4 rounded text-[#B76E79] focus:ring-[#B76E79] border-stone-300"
                    />
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-[#B76E79]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                        Choisir du sur mesure
                      </span>
                    </div>
                  </label>
                  <p className="text-[11px] text-stone-600 pl-7 font-light">
                    Le client peut saisir son nombre de mL souhaité.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300/60 space-y-1.5">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-800 focus:ring-amber-800 border-stone-300"
                    />
                    <div className="flex items-center space-x-1.5">
                      <Star className="w-4 h-4 text-amber-700 fill-amber-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                        Afficher en Best-Seller
                      </span>
                    </div>
                  </label>
                  <p className="text-[11px] text-stone-600 pl-7 font-light">
                    Met en avant ce parfum dans la section Best-Sellers.
                  </p>
                </div>
              </div>

              {/* DYNAMIC FORMATS EDITOR */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Formats standards (ex: 5 mL, 16 mL, 20 mL, 100 mL)
                    </h4>
                    <p className="text-[10px] text-stone-500">Taille (mL), Prix (FCFA) et Stock disponible.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addFormatField}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#FDF6F7] hover:bg-[#FBEBEF] text-[#B76E79] border border-[#D8A7B1] text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Format</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formats.map((fmt) => (
                    <div
                      key={fmt.id}
                      className="p-3 bg-stone-50 border border-stone-200 rounded-lg grid grid-cols-12 gap-3 items-center"
                    >
                      <div className="col-span-3">
                        <label className="block text-[10px] text-stone-500 uppercase font-semibold">Taille (mL)</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={fmt.sizeMl}
                          onChange={(e) => updateFormatField(fmt.id, 'sizeMl', parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                        />
                      </div>

                      <div className="col-span-5">
                        <label className="block text-[10px] text-stone-500 uppercase font-semibold">Prix (FCFA)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={fmt.price}
                          onChange={(e) => updateFormatField(fmt.id, 'price', parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="block text-[10px] text-stone-500 uppercase font-semibold">Stock</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={fmt.stock}
                          onChange={(e) => updateFormatField(fmt.id, 'stock', parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                        />
                      </div>

                      <div className="col-span-1 text-center pt-3">
                        <button
                          type="button"
                          onClick={() => removeFormatField(fmt.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50"
                          title="Supprimer ce format"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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
