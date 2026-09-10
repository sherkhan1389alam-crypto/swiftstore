import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, Category, ProductVariant } from '../../lib/types';
import { compressImage } from '../../lib/imageUtils';
import { Loader2, ArrowLeft, Upload, X, Save, Plus, Trash2 } from 'lucide-react';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [cost, setCost] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [lowStockThreshold, setLowStockThreshold] = useState<number | ''>('');
  const [inventoryTracking, setInventoryTracking] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'OUT_OF_STOCK' | 'DISABLED'>('PUBLISHED');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  
  const [images, setImages] = useState<string[]>([]);

  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const list: Category[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() } as Category));
      setCategories(list);
      if (!isEdit && list.length > 0) setCategoryId(list[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProduct = async () => {
    try {
      const d = await getDoc(doc(db, 'products', id!));
      if (d.exists()) {
        const p = d.data() as Product;
        setName(p.name);
        setSlug(p.slug || '');
        setDescription(p.description);
        setPrice(p.price);
        setOriginalPrice(p.originalPrice || '');
        setCost(p.cost || 0);
        setStock(p.stock !== undefined ? p.stock : '');
        setLowStockThreshold(p.lowStockThreshold || 5);
        setInventoryTracking(p.inventoryTracking !== false);
        setCategoryId(p.categoryId);
        setSku(p.sku || '');
        setStatus(p.status || 'PUBLISHED');
        setIsFeatured(p.isFeatured || false);
        setIsNewArrival(p.isNewArrival || false);
        setIsBestSeller(p.isBestSeller || false);
        setImages(p.images?.length ? p.images : [p.imageUrl]);
        setHasVariants(p.hasVariants || false);
        setVariants(p.variants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setImages(prev => [...prev, compressed]);
    } catch (err) {
      console.error(err);
    }
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { id: Date.now().toString(), name: '', price: Number(price) || 0, stock: 0 }]);
  };

  const updateVariant = (id: string, field: string, value: any) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images.length) return alert('At least one image is required.');
    
    setSaving(true);
    try {
      
    let currentSlug = slug;
    if (!currentSlug) {
      currentSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      currentSlug += '-' + Math.floor(Math.random() * 100000);
    }
    const productData: Partial<Product & {slug: string}> = {
      slug: currentSlug,
        name,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        cost: Number(cost),
        stock: stock !== '' ? Number(stock) : undefined,
        lowStockThreshold: Number(lowStockThreshold),
        inventoryTracking,
        categoryId,
        sku,
        status,
        isFeatured,
        isNewArrival,
        isBestSeller,
        imageUrl: images[0],
        images,
        variants: hasVariants ? variants : [],
        updatedAt: Date.now()
      };

      if (isEdit) {
        await setDoc(doc(db, 'products', id!), productData, { merge: true });
      } else {
        productData.createdAt = Date.now();
        await addDoc(collection(db, 'products'), productData);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const profit = Number(price) - Number(cost);
  const margin = Number(price) > 0 ? (profit / Number(price)) * 100 : 0;

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/products" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-slate-500">Configure product details, pricing, inventory, and variants.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Name *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description *</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={5} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Pricing & Profit</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input required type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">MRP / Original Price (₹)</label>
                  <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Cost Price (₹)</label>
                <input type="number" value={cost} onChange={e => setCost(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-indigo-900">Estimated Profit</p>
                  <p className="text-xs text-indigo-600 font-medium">Selling Price - Cost Price</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>₹{profit}</p>
                  <p className={`text-sm font-bold ${margin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{margin.toFixed(1)}% margin</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Product Variants</h2>
                <label className="flex items-center cursor-pointer gap-2">
                  <span className="text-sm font-medium text-slate-700">Enable</span>
                  <div className="relative">
                    <input type="checkbox" checked={hasVariants} onChange={e => setHasVariants(e.target.checked)} className="sr-only" />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${hasVariants ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hasVariants ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>

              {hasVariants && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {variants.map((v, i) => (
                    <div key={v.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                      <button type="button" onClick={() => removeVariant(v.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Variant Name (e.g. XL, Red)</label>
                          <input type="text" value={v.name} onChange={e => updateVariant(v.id, 'name', e.target.value)} className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                          <input type="number" value={v.price} onChange={e => updateVariant(v.id, 'price', Number(e.target.value))} className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">SKU</label>
                          <input type="text" value={v.sku || ''} onChange={e => updateVariant(v.id, 'sku', e.target.value)} className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Stock</label>
                          <input type="number" value={v.stock} onChange={e => updateVariant(v.id, 'stock', Number(e.target.value))} className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addVariant} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                    <Plus className="w-4 h-4" /> Add Variant
                  </button>
                </div>
              )}
            </div>

          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Organization & Inventory</h2>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category *</label>
                <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">SKU (Stock Keeping Unit)</label>
                <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 mb-3">
                  <input type="checkbox" checked={inventoryTracking} onChange={e => setInventoryTracking(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                  <span className="text-sm font-bold text-slate-700">Track Inventory</span>
                </label>
                {inventoryTracking && !hasVariants && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Stock Qty</label>
                      <input type="number" value={stock} onChange={e => setStock(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Low Stock Alert</label>
                      <input type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                  <span className="text-sm font-bold text-slate-700">Featured Product</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isNewArrival} onChange={e => setIsNewArrival(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                  <span className="text-sm font-bold text-slate-700">New Arrival</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isBestSeller} onChange={e => setIsBestSeller(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                  <span className="text-sm font-bold text-slate-700">Best Seller</span>
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Images *</h2>
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl bg-slate-100 relative group overflow-hidden border border-slate-200">
                    <img src={img} alt="Product" className="w-full h-full object-contain" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-500"><X className="w-4 h-4"/></button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold uppercase tracking-wider">Add</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
            
            <button type="submit" disabled={saving} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
