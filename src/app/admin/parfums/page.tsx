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
  Layers
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/productsService';
import { getCategories } from '@/services/categoriesService';
import { Product, Category, ProductFormat } from '@/types';
import { formatPrice } from '@/lib/whatsapp';

export default function AdminParfumsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [formats, setFormats] = useState<ProductFormat[]>([
    { id: 'fmt-1', sizeMl: 50, price: 22000, stock: 15 },
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
      const [prodData, catData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err: any) {
      setError('Impossible de charger les parfums ou catégories.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategoryId(categories.length > 0 ? categories[0].id : '');
    setFormats([
      { id: 'fmt-' + Date.now() + '-1', sizeMl: 30, price: 15000, stock: 20 },
      { id: 'fmt-' + Date.now() + '-2', sizeMl: 50, price: 22000, stock: 15 },
      { id: 'fmt-' + Date.now() + '-3', sizeMl: 100, price: 35000, stock: 8 },
    ]);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description || '');
    setCategoryId(prod.categoryId);
    setFormats(prod.formats || []);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  // Format Handlers (Dynamic format addition/removal/update)
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
    if (!categoryId) {
      setError('Veuillez sélectionner une catégorie pour ce parfum.');
      return;
    }
    if (formats.length === 0) {
      setError('Veuillez ajouter au moins un format (mL, Prix, Stock).');
      return;
    }

    setSubmitting(true);

    try {
      const selectedCat = categories.find((c) => c.id === categoryId);
      const payload = {
        name: name.trim(),
        description: description.trim(),
        categoryId,
        categoryName: selectedCat ? selectedCat.name : '',
        formats,
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
    : products.filter((p) => p.categoryId === selectedCategoryFilter);

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-900/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-amber-100 flex items-center space-x-3">
            <Package className="w-7 h-7 text-amber-400" />
            <span>Gestion des Parfums & Formats</span>
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Gérez vos eaux de parfum, ajustez les prix en FCFA et suivez les stocks disponibles par format.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un parfum</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-neutral-900/60 rounded-2xl border border-neutral-800">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-200">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Filtrer par catégorie :</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategoryFilter === 'all'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            Toutes ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryFilter(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategoryFilter === c.id
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
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
        <div className="p-4 bg-red-950/70 border border-red-800 rounded-2xl flex items-center space-x-3 text-red-300 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800 rounded-2xl flex items-center space-x-3 text-emerald-300 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* PRODUCTS LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-3">
          <p className="text-neutral-300 font-medium">Aucun parfum trouvé pour ce filtre.</p>
          <button
            onClick={handleOpenAddModal}
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            Ajouter un nouveau parfum
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                      {prod.categoryName || 'Catégorie n/a'}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-amber-100">{prod.name}</h3>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id, prod.name)}
                      className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-900/40 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-3">
                  {prod.description || 'Aucune description.'}
                </p>
              </div>

              {/* FORMATS TABLE LIST */}
              <div className="pt-4 border-t border-neutral-800 space-y-2">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Formats & Stocks définis :</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {prod.formats.map((fmt) => (
                    <div
                      key={fmt.id || fmt.sizeMl}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between space-y-1 ${
                        fmt.stock > 0
                          ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                          : 'bg-red-950/30 border-red-900/40 text-red-300'
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{fmt.sizeMl} mL</span>
                        <span className="text-amber-400">{formatPrice(fmt.price)}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {fmt.stock > 0 ? `Stock : ${fmt.stock}` : 'Rupture de stock'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-amber-900/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h3 className="text-xl font-serif font-bold text-amber-100">
                {editingProduct ? 'Modifier le parfum' : 'Ajouter un parfum'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Nom du parfum <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dior Sauvage"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Catégorie <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="" disabled>Sélectionner une catégorie</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Description de la fragrance
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes olfactives, inspiration, sillage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* DYNAMIC FORMATS EDITOR (Section 27 & 28) */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                      Formats disponibles & Tarification
                    </h4>
                    <p className="text-[10px] text-neutral-400">Définissez la taille (mL), le prix (FCFA) et le stock disponible.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addFormatField}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Ajouter un format</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formats.map((fmt, index) => (
                    <div
                      key={fmt.id}
                      className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl grid grid-cols-12 gap-3 items-center"
                    >
                      <div className="col-span-3">
                        <label className="block text-[10px] text-neutral-400 uppercase">Taille (mL)</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={fmt.sizeMl}
                          onChange={(e) => updateFormatField(fmt.id, 'sizeMl', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="col-span-5">
                        <label className="block text-[10px] text-neutral-400 uppercase">Prix (FCFA)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={fmt.price}
                          onChange={(e) => updateFormatField(fmt.id, 'price', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="block text-[10px] text-neutral-400 uppercase">Stock</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={fmt.stock}
                          onChange={(e) => updateFormatField(fmt.id, 'stock', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="col-span-1 text-center pt-3">
                        <button
                          type="button"
                          onClick={() => removeFormatField(fmt.id)}
                          className="p-1 rounded text-red-400 hover:bg-red-950"
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
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold uppercase"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-bold uppercase tracking-wider shadow-md"
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
