'use client';

import React, { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Package, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Building2,
  Image as ImageIcon,
  Upload,
  Gift,
  Diamond,
  Droplet,
  Search,
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/productsService';
import { getBrands, Brand } from '@/services/brandsService';
import { 
  importSoniaCatalogue, 
  buildStandardFormats, 
  ImportTargetCategory 
} from '@/services/catalogueImportService';
import { 
  SONIA_CATALOGUE, 
  EXTRAIT_FORMATS, 
  HUILE_FORMATS, 
  DEFAULT_STOCK 
} from '@/data/soniaCatalogue';
import { Product, ProductFormat } from '@/types';
import { formatPrice } from '@/lib/whatsapp';
import { uploadToCloudinary } from '@/lib/cloudinary';

const ITEMS_PER_PAGE = 24;

function AdminParfumsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTypeFilter = searchParams.get('type') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<'all' | 'homme' | 'femme' | 'unisexe'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // PDF Preview Drawer State
  const [showPdfCatalogueModal, setShowPdfCatalogueModal] = useState(false);
  const [pdfSearch, setPdfSearch] = useState('');

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
  const [gender, setGender] = useState<'homme' | 'femme' | 'unisexe'>('unisexe');
  
  // Specific Category Flags & Prices
  const [categoryType, setCategoryType] = useState<'huiles-parfumees' | 'extraits-parfums' | 'parfums-authentiques' | 'coffrets'>('huiles-parfumees');
  const [priceHuile, setPriceHuile] = useState<number>(1000);
  const [priceExtrait, setPriceExtrait] = useState<number>(1500);
  const [priceAuthentic, setPriceAuthentic] = useState<number>(25000);
  const [stockAuthentic, setStockAuthentic] = useState<number>(50);
  const [priceCoffret, setPriceCoffret] = useState<number>(35000);
  const [coffretContentString, setCoffretContentString] = useState<string>('');
  const [formats, setFormats] = useState<ProductFormat[]>(buildStandardFormats('huile'));

  // UI Alerts & Operations
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodData, brandData] = await Promise.all([
        getProducts(),
        getBrands(),
      ]);
      setProducts(prodData);
      setBrands(brandData);
    } catch {
      setError('Impossible de charger les données depuis la base de données.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [prodData, brandData] = await Promise.all([
          getProducts(),
          getBrands(),
        ]);
        if (isMounted) {
          setProducts(prodData);
          setBrands(brandData);
        }
      } catch {
        if (isMounted) {
          setError('Impossible de charger les données depuis la base de données.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectCategoryTab = (type: string) => {
    setCurrentPage(1);
    if (type === 'all') {
      router.push(pathname);
    } else {
      router.push(`${pathname}?type=${type}`);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleBrandFilterChange = (val: string) => {
    setSelectedBrandFilter(val);
    setCurrentPage(1);
  };

  const handleGenderFilterChange = (val: 'all' | 'homme' | 'femme' | 'unisexe') => {
    setSelectedGenderFilter(val);
    setCurrentPage(1);
  };

  // Catalogue PDF Statistics
  const totalPdfScentsCount = useMemo(() => {
    return SONIA_CATALOGUE.reduce((acc, h) => acc + h.scents.length, 0);
  }, []);

  const totalExtraitsCount = useMemo(() => {
    return products.filter(p => !p.isCoffret && !p.isAuthentic && p.priceExtrait).length;
  }, [products]);

  const totalHuilesCount = useMemo(() => {
    return products.filter(p => !p.isCoffret && !p.isAuthentic && (p.priceHuile || (!p.priceExtrait && !p.isAuthentic && !p.isCoffret))).length;
  }, [products]);

  const totalAuthentiquesCount = useMemo(() => {
    return products.filter(p => p.isAuthentic || p.priceAuthentic).length;
  }, [products]);

  const totalCoffretsCount = useMemo(() => {
    return products.filter(p => p.isCoffret || p.priceCoffret).length;
  }, [products]);

  // Synchronisation / Importation du PDF selon la catégorie
  const handleImportCatalogueByCategory = async (target: ImportTargetCategory) => {
    const label =
      target === 'huiles-parfumees'
        ? 'les Huiles Parfumées (formats 3 à 20 mL, stock 50)'
        : target === 'extraits-parfums'
        ? 'les Extraits de Parfum (formats 16 à 100 mL, stock 50)'
        : 'l\'ensemble des Extraits et des Huiles Parfumées (stock 50)';

    if (!window.confirm(
      `Synchroniser ${label} depuis le document Sonia_Perfumery_Selection_Homme_Femme_Unisexe.pdf ?\n\n` +
      `- 349 senteurs réparties sur 52 maisons de parfum\n` +
      `- Classement Homme, Femme et Unisexe\n` +
      `- Les senteurs déjà existantes seront mises à jour sans doublon.`
    )) {
      return;
    }

    setImporting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await importSoniaCatalogue(target);
      const parts: string[] = [];
      if (res.extraitsCreated > 0 || res.extraitsUpdated > 0) {
        parts.push(`${res.extraitsCreated} extraits créés, ${res.extraitsUpdated} mis à jour`);
      }
      if (res.huilesCreated > 0 || res.huilesUpdated > 0) {
        parts.push(`${res.huilesCreated} huiles créées, ${res.huilesUpdated} mises à jour`);
      }
      setSuccess(`Catalogue PDF synchronisé avec succès : ${parts.join(' — ') || 'aucun changement nécessaire'}.`);
      await fetchInitialData();
    } catch (err: unknown) {
      console.error('Catalogue import error:', err);
      setError((err as Error).message || 'Erreur lors de la synchronisation du catalogue.');
    } finally {
      setImporting(false);
    }
  };

  const handleApplyStandardFormats = (type: 'extraits-parfums' | 'huiles-parfumees') => {
    if (type === 'extraits-parfums') {
      setFormats(buildStandardFormats('extrait'));
      setPriceExtrait(EXTRAIT_FORMATS[0].price);
    } else {
      setFormats(buildStandardFormats('huile'));
      setPriceHuile(HUILE_FORMATS[0].price);
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
    setGender('unisexe');
    setCategoryType(defaultCategory as 'huiles-parfumees' | 'extraits-parfums' | 'parfums-authentiques' | 'coffrets');
    setPriceHuile(1000);
    setPriceExtrait(1500);
    setPriceAuthentic(25000);
    setStockAuthentic(50);
    setPriceCoffret(35000);
    setCoffretContentString('');
    
    // Initialise automatiquement les formats conformes
    if (defaultCategory === 'extraits-parfums') {
      setFormats(buildStandardFormats('extrait'));
      setAllowCustomVolume(true);
    } else if (defaultCategory === 'huiles-parfumees') {
      setFormats(buildStandardFormats('huile'));
      setAllowCustomVolume(true);
    } else if (defaultCategory === 'parfums-authentiques') {
      setFormats([{ id: 'flacon-authentique', sizeMl: 0, price: 25000, stock: 50 }]);
      setAllowCustomVolume(false);
    } else {
      setFormats([{ id: 'fmt-' + Date.now(), sizeMl: 100, price: 35000, stock: 50 }]);
      setAllowCustomVolume(false);
    }

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
    setGender(prod.gender || 'unisexe');
    
    if (prod.isCoffret) {
      setCategoryType('coffrets');
    } else if (prod.isAuthentic) {
      setCategoryType('parfums-authentiques');
    } else if (prod.priceExtrait && !prod.priceHuile) {
      setCategoryType('extraits-parfums');
    } else {
      setCategoryType('huiles-parfumees');
    }

    setPriceHuile(prod.priceHuile || 1000);
    setPriceExtrait(prod.priceExtrait || 1500);
    setPriceAuthentic(prod.priceAuthentic || prod.formats?.[0]?.price || 25000);
    setStockAuthentic(prod.stock ?? prod.formats?.[0]?.stock ?? 50);
    setPriceCoffret(prod.priceCoffret || 35000);
    setCoffretContentString(prod.coffretContent ? prod.coffretContent.join(', ') : '');
    setFormats(prod.formats || []);
    if (prod.isAuthentic) {
      setAllowCustomVolume(false);
    }
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const addFormatField = () => {
    setFormats((prev) => [
      ...prev,
      { id: 'fmt-' + Date.now(), sizeMl: 50, price: 5000, stock: DEFAULT_STOCK },
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
      setError('Le nom de l\'article est obligatoire.');
      return;
    }

    if ((categoryType === 'huiles-parfumees' || categoryType === 'extraits-parfums') && !brand.trim()) {
      setError('Veuillez sélectionner ou indiquer une Maison de Parfum pour cette catégorie.');
      return;
    }

    setSubmitting(true);

    try {
      let finalImageUrl = (categoryType === 'huiles-parfumees' || categoryType === 'extraits-parfums') ? '' : imageUrl.trim();

      if (imageFile && categoryType !== 'huiles-parfumees' && categoryType !== 'extraits-parfums') {
        setUploading(true);
        try {
          finalImageUrl = await uploadToCloudinary(imageFile);
        } catch (uploadErr: unknown) {
          setError((uploadErr as Error).message || "Échec de l'envoi de l'image.");
          setSubmitting(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      const coffretArr = coffretContentString
        ? coffretContentString.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const finalFormats =
        categoryType === 'parfums-authentiques'
          ? [{ id: 'flacon-authentique', sizeMl: 0, price: priceAuthentic, stock: stockAuthentic }]
          : formats.length > 0
          ? formats
          : [{ id: 'default', sizeMl: 100, price: priceAuthentic || priceCoffret || 25000, stock: DEFAULT_STOCK }];

      const rawPayload = {
        name: name.trim(),
        brand: brand.trim(),
        description: description.trim(),
        imageUrl: finalImageUrl,
        gender: gender,
        formats: finalFormats,
        stock: categoryType === 'parfums-authentiques' ? stockAuthentic : undefined,
        allowCustomVolume: categoryType === 'parfums-authentiques' ? false : allowCustomVolume,
        isBestSeller,
        priceHuile: categoryType === 'huiles-parfumees' ? priceHuile : undefined,
        priceExtrait: categoryType === 'extraits-parfums' ? priceExtrait : undefined,
        priceAuthentic: categoryType === 'parfums-authentiques' ? priceAuthentic : undefined,
        priceCoffret: categoryType === 'coffrets' ? priceCoffret : undefined,
        isAuthentic: categoryType === 'parfums-authentiques',
        isCoffret: categoryType === 'coffrets',
        coffretContent: coffretArr,
        categoryName: categoryType === 'huiles-parfumees' ? 'Huiles parfumées' :
                      categoryType === 'extraits-parfums' ? 'Extraits de parfum' :
                      categoryType === 'parfums-authentiques' ? 'Parfums authentiques' : 'Coffret',
      };

      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(([, v]) => v !== undefined)
      ) as unknown as Product;

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setSuccess('Article mis à jour avec succès.');
      } else {
        await createProduct(payload);
        setSuccess('Article créé avec succès.');
      }

      setIsModalOpen(false);
      fetchInitialData();
    } catch (err: unknown) {
      console.error('Product submit error:', err);
      setError((err as Error).message || 'Erreur lors de l\'enregistrement.');
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
    } catch {
      setError('Impossible de supprimer cet article.');
    }
  };

  // Filter List according to activeTypeFilter, search, brand, gender
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Category Filter
      if (activeTypeFilter === 'huiles-parfumees') {
        const isHuile = !p.isCoffret && !p.isAuthentic && (p.priceHuile || (!p.priceExtrait && !p.isAuthentic && !p.isCoffret));
        if (!isHuile) return false;
      } else if (activeTypeFilter === 'extraits-parfums') {
        const isExtrait = !p.isCoffret && !p.isAuthentic && p.priceExtrait;
        if (!isExtrait) return false;
      } else if (activeTypeFilter === 'parfums-authentiques') {
        const isAuth = p.isAuthentic || p.priceAuthentic;
        if (!isAuth) return false;
      } else if (activeTypeFilter === 'coffrets') {
        const isCoffret = p.isCoffret || p.priceCoffret;
        if (!isCoffret) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = (p.brand || '').toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchDesc) return false;
      }

      // 3. Brand Filter
      if (selectedBrandFilter !== 'all') {
        if ((p.brand || '').toUpperCase() !== selectedBrandFilter.toUpperCase()) return false;
      }

      // 4. Gender Filter
      if (selectedGenderFilter !== 'all') {
        if ((p.gender || 'unisexe') !== selectedGenderFilter) return false;
      }

      return true;
    });
  }, [products, activeTypeFilter, searchQuery, selectedBrandFilter, selectedGenderFilter]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const sectionTitle =
    activeTypeFilter === 'huiles-parfumees' ? 'Huiles Parfumées' :
    activeTypeFilter === 'extraits-parfums' ? 'Extraits de Parfum' :
    activeTypeFilter === 'parfums-authentiques' ? 'Parfums Authentiques' :
    activeTypeFilter === 'coffrets' ? 'Coffrets Cadeaux' : 'Tous les Parfums';

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center space-x-3">
            <Package className="w-7 h-7 text-[#B76E79]" />
            <span>Gestion des Parfums</span>
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Gérez vos collections réelles et synchronisez les 349 senteurs du catalogue PDF Sonia Perfumery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPdfCatalogueModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <FileText className="w-4 h-4 text-[#B76E79]" />
            <span>Consulter le PDF ({totalPdfScentsCount} senteurs)</span>
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un article</span>
          </button>
        </div>
      </div>

      {/* 2. NOTIFICATIONS */}
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

      {/* 3. DEDICATED CATALOGUE PDF HUB (SYNCHRONISATION PAR CATÉGORIE) */}
      <section className="bg-gradient-to-br from-[#FAF0ED] to-[#FFF8F6] border border-[#E8D5D0] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-[#B76E79]/30 text-[#B76E79] text-[10px] font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Sonia_Perfumery_Selection_Homme_Femme_Unisexe.pdf</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Synchronisation du Catalogue PDF par Catégorie
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Le catalogue source regroupe <strong className="text-stone-900">{totalPdfScentsCount} senteurs</strong> réparties sur <strong className="text-stone-900">{SONIA_CATALOGUE.length} maisons de parfum</strong> pour <span className="font-semibold text-stone-800">Homme, Femme et Unisexe</span>. Mettez à jour vos extraits ou huiles en 1 clic selon les tarifs et formats officiels.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 flex-shrink-0 text-center">
            <div className="p-3 bg-white border border-stone-200/80 rounded-xl shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Extraits en base</span>
              <span className="text-xl font-serif font-bold text-[#B76E79]">
                {totalExtraitsCount} <span className="text-xs text-stone-400 font-sans font-normal">/ {totalPdfScentsCount}</span>
              </span>
              <span className="text-[9px] text-stone-400 block mt-0.5">16 - 100 mL (1500-15000 F)</span>
            </div>

            <div className="p-3 bg-white border border-stone-200/80 rounded-xl shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Huiles en base</span>
              <span className="text-xl font-serif font-bold text-[#B76E79]">
                {totalHuilesCount} <span className="text-xs text-stone-400 font-sans font-normal">/ {totalPdfScentsCount}</span>
              </span>
              <span className="text-[9px] text-stone-400 block mt-0.5">3 - 20 mL (1000-5000 F)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons for PDF Sync */}
        <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-stone-600">
            Stock configuré par défaut à <strong className="text-stone-900">50 unités</strong> sur chaque format.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sync Button tailored to active category or all */}
            {(activeTypeFilter === 'all' || activeTypeFilter === 'extraits-parfums') && (
              <button
                type="button"
                onClick={() => handleImportCatalogueByCategory('extraits-parfums')}
                disabled={importing}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-[#B76E79] text-[#B76E79] hover:bg-[#B76E79] hover:text-white disabled:opacity-50 font-bold text-xs uppercase tracking-wider transition-all shadow-2xs"
              >
                {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Mettre à jour les Extraits (PDF)</span>
              </button>
            )}

            {(activeTypeFilter === 'all' || activeTypeFilter === 'huiles-parfumees') && (
              <button
                type="button"
                onClick={() => handleImportCatalogueByCategory('huiles-parfumees')}
                disabled={importing}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-[#B76E79] text-[#B76E79] hover:bg-[#B76E79] hover:text-white disabled:opacity-50 font-bold text-xs uppercase tracking-wider transition-all shadow-2xs"
              >
                {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Mettre à jour les Huiles (PDF)</span>
              </button>
            )}

            {activeTypeFilter === 'all' && (
              <button
                type="button"
                onClick={() => handleImportCatalogueByCategory('all')}
                disabled={importing}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#B76E79] hover:bg-[#a25a65] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
              >
                {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Tout mettre à jour (Huiles + Extraits)</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. CATEGORY TABS BAR */}
      <div className="flex items-center overflow-x-auto border-b border-stone-200 pb-px gap-2 no-scrollbar">
        {[
          { id: 'all', label: 'Toutes les Catégories', count: products.length },
          { id: 'huiles-parfumees', label: 'Huiles Parfumées', count: totalHuilesCount },
          { id: 'extraits-parfums', label: 'Extraits de Parfum', count: totalExtraitsCount },
          { id: 'parfums-authentiques', label: 'Parfums Authentiques', count: totalAuthentiquesCount },
          { id: 'coffrets', label: 'Coffrets', count: totalCoffretsCount },
        ].map((tab) => {
          const isActive = activeTypeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectCategoryTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-xs font-serif font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? 'border-[#B76E79] text-[#B76E79] bg-white'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans ${
                isActive ? 'bg-[#FAF0ED] text-[#B76E79]' : 'bg-stone-100 text-stone-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. SEARCH & FILTER TOOLBAR */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher par nom de senteur, marque, description..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-[#B76E79]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Maison Filter */}
          <select
            value={selectedBrandFilter}
            onChange={(e) => handleBrandFilterChange(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 uppercase focus:outline-none focus:border-[#B76E79]"
          >
            <option value="all">Toutes les Maisons ({brands.length})</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={selectedGenderFilter}
            onChange={(e) => handleGenderFilterChange(e.target.value as 'all' | 'homme' | 'femme' | 'unisexe')}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 uppercase focus:outline-none focus:border-[#B76E79]"
          >
            <option value="all">Tous les Genres</option>
            <option value="femme">Femme</option>
            <option value="homme">Homme</option>
            <option value="unisexe">Unisexe</option>
          </select>

          {(searchQuery || selectedBrandFilter !== 'all' || selectedGenderFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrandFilter('all');
                setSelectedGenderFilter('all');
                setCurrentPage(1);
              }}
              className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 text-xs font-medium"
              title="Réinitialiser les filtres"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 6. PRODUCTS LIST & GRID */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 text-[#B76E79] animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-4 p-8">
          <p className="text-stone-800 font-serif font-bold text-base">
            Aucun article trouvé pour les critères sélectionnés.
          </p>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {activeTypeFilter === 'huiles-parfumees'
              ? 'Aucune huile parfumée n\'est encore présente. Vous pouvez lancer la synchronisation depuis le catalogue PDF ci-dessus.'
              : activeTypeFilter === 'extraits-parfums'
              ? 'Aucun extrait de parfum n\'est encore présent. Vous pouvez lancer la synchronisation depuis le catalogue PDF ci-dessus.'
              : 'Essayez de réinitialiser la recherche ou d\'ajouter un nouvel article.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {(activeTypeFilter === 'huiles-parfumees' || activeTypeFilter === 'extraits-parfums') && (
              <button
                onClick={() => handleImportCatalogueByCategory(activeTypeFilter as ImportTargetCategory)}
                className="px-4 py-2 rounded-lg bg-[#B76E79] text-white text-xs font-bold uppercase tracking-wider"
              >
                Synchroniser {sectionTitle}
              </button>
            )}
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-wider hover:bg-stone-200"
            >
              + Ajouter un article
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs text-stone-500 px-1">
            <span>
              Affichage de <strong className="text-stone-900">{paginatedProducts.length}</strong> sur <strong className="text-stone-900">{filteredProducts.length}</strong> article(s) trouvé(s)
            </span>
            <span>Page {currentPage} sur {totalPages}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedProducts.map((prod) => {
              const isExtrait = prod.priceExtrait || (!prod.isAuthentic && !prod.isCoffret && (prod.categoryName || '').toLowerCase().includes('extrait'));
              const isHuile = !prod.isCoffret && !prod.isAuthentic && !isExtrait;

              return (
                <div
                  key={prod.id}
                  className="bg-white border border-stone-200/90 rounded-xl p-5 space-y-4 shadow-2xs hover:shadow-xs hover:border-[#B76E79]/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    
                    {/* TOP BADGES & ACTIONS */}
                    <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        {prod.brand ? (
                          <span className="text-[10px] uppercase font-serif font-bold tracking-widest text-[#B76E79] block">
                            {prod.brand}
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-serif font-bold tracking-widest text-stone-400 block">
                            Sans Maison
                          </span>
                        )}
                        <h3 className="text-base font-serif font-bold text-stone-900 mt-0.5 leading-snug">
                          {prod.name}
                        </h3>
                      </div>

                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 rounded-md bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* CATEGORY & GENDER PILLS */}
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {isHuile && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                          <Droplet className="w-2.5 h-2.5 text-amber-700" />
                          <span>Huile Parfumée</span>
                        </span>
                      )}
                      {isExtrait && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-900 font-semibold">
                          <Sparkles className="w-2.5 h-2.5 text-rose-700" />
                          <span>Extrait de Parfum</span>
                        </span>
                      )}
                      {prod.isAuthentic && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                          <Diamond className="w-2.5 h-2.5 text-emerald-700" />
                          <span>Authentique</span>
                        </span>
                      )}
                      {prod.isCoffret && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-900 font-semibold">
                          <Gift className="w-2.5 h-2.5 text-purple-700" />
                          <span>Coffret</span>
                        </span>
                      )}
                      {prod.gender && (
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-serif uppercase tracking-wider font-semibold">
                          {prod.gender}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-2">
                      {prod.description || 'Senteur élaborée en haute qualité avec une excellente tenue.'}
                    </p>

                    {/* FORMATS CHIPS OU BADGE FLACON AUTHENTIQUE (PAS DE ML) */}
                    {prod.isAuthentic || prod.priceAuthentic ? (
                      <div className="pt-2 flex items-center justify-between text-xs bg-stone-50 border border-stone-200/80 rounded-lg p-2.5">
                        <div className="flex items-center space-x-1.5 text-stone-700">
                          <Diamond className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="font-semibold text-xs">Flacon d&apos;origine authentique</span>
                        </div>
                        <span className="text-[11px] font-bold text-stone-600">
                          Stock : {prod.stock ?? prod.formats?.[0]?.stock ?? 50} unités
                        </span>
                      </div>
                    ) : prod.formats && prod.formats.length > 0 ? (
                      <div className="pt-2">
                        <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block mb-1.5">
                          Formats disponibles ({prod.formats.length}) :
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {prod.formats.map((fmt) => (
                            <span
                              key={fmt.id || fmt.sizeMl}
                              className="inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-stone-50 border border-stone-200 text-[11px] text-stone-800"
                            >
                              <span className="font-bold">{fmt.sizeMl} mL</span>
                              <span className="text-stone-400">·</span>
                              <span className="text-[#B76E79] font-bold">{formatPrice(fmt.price)}</span>
                              <span className="text-[9px] text-stone-500">({fmt.stock} en stock)</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                  </div>

                  {/* BOTTOM PRICE FOOTER */}
                  <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-medium">
                      {prod.isAuthentic || prod.priceAuthentic ? (
                        "Prix officiel"
                      ) : prod.isCoffret || prod.priceCoffret ? (
                        "Prix coffret"
                      ) : (
                        "À partir de"
                      )}
                    </span>
                    <span className="font-bold text-[#B76E79] text-sm">
                      {formatPrice(
                        prod.isAuthentic || prod.priceAuthentic
                          ? (prod.priceAuthentic || (prod.formats?.[0]?.price) || 25000)
                          : prod.isCoffret || prod.priceCoffret
                          ? (prod.priceCoffret || (prod.formats?.[0]?.price) || 35000)
                          : prod.formats && prod.formats.length > 0
                          ? Math.min(...prod.formats.map((f) => f.price))
                          : (prod.priceHuile || prod.priceExtrait || 0)
                      )}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* 7. PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-stone-500">
                Page {currentPage} sur {totalPages}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = Math.min(currentPage - 2 + i, totalPages);
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#B76E79] text-white'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 8. CATALOGUE PDF VIEWER MODAL */}
      {showPdfCatalogueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col">
            
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B76E79]">Document Source</span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Catalogue Sonia Perfumery ({totalPdfScentsCount} Senteurs)
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Extrait du fichier <code className="text-stone-800">Sonia_Perfumery_Selection_Homme_Femme_Unisexe.pdf</code>
                </p>
              </div>

              <button
                onClick={() => setShowPdfCatalogueModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter in Modal */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une senteur ou une maison dans le catalogue PDF..."
                value={pdfSearch}
                onChange={(e) => setPdfSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-[#B76E79]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            {/* Houses and Scents Scrollable Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {SONIA_CATALOGUE.filter((h) => {
                if (!pdfSearch.trim()) return true;
                const q = pdfSearch.toLowerCase();
                return h.brand.toLowerCase().includes(q) || h.scents.some((s) => s.name.toLowerCase().includes(q));
              }).map((house) => (
                <div key={house.brand} className="border border-stone-200/90 rounded-xl p-4 bg-stone-50/50 space-y-3">
                  <div className="flex justify-between items-center border-b border-stone-200/70 pb-2">
                    <h4 className="font-serif font-bold text-sm text-stone-900 uppercase tracking-wide">
                      {house.brand}
                    </h4>
                    <span className="text-[10px] text-stone-500 font-sans font-semibold">
                      {house.scents.length} senteur(s)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {house.scents.map((s) => (
                      <div
                        key={s.name + s.gender}
                        className="bg-white p-2.5 rounded-lg border border-stone-200/80 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-stone-900">{s.name}</span>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          s.gender === 'femme' ? 'bg-pink-50 text-pink-700' :
                          s.gender === 'homme' ? 'bg-blue-50 text-blue-700' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {s.gender}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setShowPdfCatalogueModal(false)}
                className="px-5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 9. ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl my-auto">
            
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
                  onChange={(e) => {
                    const newType = e.target.value as 'huiles-parfumees' | 'extraits-parfums' | 'parfums-authentiques' | 'coffrets';
                    setCategoryType(newType);
                    if (newType === 'huiles-parfumees') {
                      setFormats(buildStandardFormats('huile'));
                    } else if (newType === 'extraits-parfums') {
                      setFormats(buildStandardFormats('extrait'));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-bold uppercase focus:outline-none focus:border-[#B76E79]"
                >
                  <option value="huiles-parfumees">Huiles Parfumées (3 - 20 mL, sans alcool)</option>
                  <option value="extraits-parfums">Extraits de Parfum (16 - 100 mL, haute concentration)</option>
                  <option value="parfums-authentiques">Parfums Authentiques (Flacon d&apos;origine)</option>
                  <option value="coffrets">Coffret Cadeau (Spécifier le contenu)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Nom de la senteur / article <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bleu de Chanel / Sauvage"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                {/* SELECT MAISON DE PARFUM */}
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

              {/* GENRE TARGET */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Genre (Cible olfactive) <span className="text-red-600">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'homme' | 'femme' | 'unisexe')}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs font-bold uppercase focus:outline-none focus:border-[#B76E79]"
                >
                  <option value="unisexe">Unisexe</option>
                  <option value="femme">Femme</option>
                  <option value="homme">Homme</option>
                </select>
              </div>

              {/* FORMATS ET PRIX */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-200 pb-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-stone-800">
                      {categoryType === 'parfums-authentiques' 
                        ? 'Tarif & Stock Flacon Authentique' 
                        : 'Contenants et Prix selon vos besoins'}
                    </h4>
                    <p className="text-[10px] text-stone-500 font-light">
                      {categoryType === 'parfums-authentiques'
                        ? "Flacon d'origine scellé, aucun choix de mL ni sur-mesure."
                        : "Grille standard définie selon le catalogue PDF Sonia Perfumery."}
                    </p>
                  </div>
                  {(categoryType === 'huiles-parfumees' || categoryType === 'extraits-parfums') && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleApplyStandardFormats(categoryType as 'extraits-parfums' | 'huiles-parfumees')}
                        className="px-2.5 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-[10px] uppercase"
                      >
                        Formats PDF Standards
                      </button>
                      <button
                        type="button"
                        onClick={addFormatField}
                        className="px-2.5 py-1 rounded bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-[10px] uppercase flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  )}
                </div>

                {(categoryType === 'huiles-parfumees' || categoryType === 'extraits-parfums') ? (
                  <div className="space-y-2">
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
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-xs text-emerald-900 font-medium flex items-center space-x-2">
                      <Diamond className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>Parfums Authentiques : vendus en flacon d&apos;origine scellé, aucun choix de mL ni sur-mesure.</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-stone-700">Prix Flacon Authentique (FCFA) *</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={priceAuthentic}
                          onChange={(e) => setPriceAuthentic(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs font-bold text-[#B76E79]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-stone-700">Stock disponible (unités) *</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={stockAuthentic}
                          onChange={(e) => setStockAuthentic(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 font-medium"
                        />
                      </div>
                    </div>
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

              {/* PHOTO UPLOAD (MASQUÉ POUR HUILES ET EXTRAITS) */}
              {categoryType === 'huiles-parfumees' || categoryType === 'extraits-parfums' ? (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 font-medium flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Conformément à la charte, l&apos;upload de photos est réservé aux Parfums Authentiques et Coffrets.</span>
                </div>
              ) : (
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
                </div>
              )}

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
