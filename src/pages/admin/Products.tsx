import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, Category } from '../../lib/types';
import { Plus, Search, Loader2, Image as ImageIcon, Edit, Trash2, Copy, AlertTriangle, Archive, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pSnap = await getDocs(collection(db, 'products'));
      const prods: Product[] = [];
      pSnap.forEach(d => prods.push({ id: d.id, ...d.data() } as Product));
      setProducts(prods);
      setFilteredProducts(prods);

      const cSnap = await getDocs(collection(db, 'categories'));
      const cats: Category[] = [];
      cSnap.forEach(d => cats.push({ id: d.id, ...d.data() } as Category));
      setCategories(cats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = products;
    
    if (categoryFilter !== 'ALL') {
      result = result.filter(p => p.categoryId === categoryFilter);
    }
    
    if (statusFilter !== 'ALL') {
      result = result.filter(p => p.status === statusFilter);
    }
    
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        (p.sku && p.sku.toLowerCase().includes(lower))
      );
    }
    
    setFilteredProducts(result);
  }, [searchQuery, categoryFilter, statusFilter, products]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('Product deleted successfully.');
      } catch (err) {
        console.error(err);
        alert('Failed to delete product');
      }
    }
  };

  const handleDuplicate = async (product: Product) => {
    if (window.confirm(`Create a duplicate of "${product.name}"?`)) {
      try {
        const { id, ...productData } = product;
        const newProductData = {
          ...productData,
          name: `Copy of ${product.name}`,
          status: 'DRAFT',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        const newRef = doc(collection(db, 'products'));
        await setDoc(newRef, newProductData);
        setProducts(prev => [{ ...newProductData, id: newRef.id } as Product, ...prev]);
      } catch (err) {
        console.error(err);
        alert('Failed to duplicate product');
      }
    }
  };
  
  const handleArchive = async (id: string) => {
    if (window.confirm('Archive this product? It will be hidden from the store.')) {
      try {
        await setDoc(doc(db, 'products', id), { status: 'DISABLED' }, { merge: true });
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'DISABLED' } : p));
      } catch (err) {
        console.error(err);
        alert('Failed to archive product');
      }
    }
  };

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
          <p className="text-slate-500">Add, edit, and track inventory for all products.</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm min-w-[160px]"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm min-w-[160px]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="DISABLED">Archived</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price / Profit</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No products found.</td></tr>
                ) : filteredProducts.map(product => {
                  const profit = (product.price || 0) - (product.cost || 0);
                  const isLowStock = product.inventoryTracking !== false && product.stock !== undefined && product.stock <= (product.lowStockThreshold || 5);
                  
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                            {product.imageUrl ? (
                              <img className="h-full w-full object-cover" src={product.imageUrl} alt="" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-slate-300" /></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900">{product.name}</div>
                            <div className="text-xs text-slate-500">{product.sku || 'No SKU'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">₹{product.price.toLocaleString()}</div>
                        {product.cost ? (
                          <div className={`text-xs font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            Profit: ₹{profit.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400">Cost not set</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.hasVariants ? (
                          <div className="text-sm font-bold text-indigo-600">{product.variants?.length || 0} Variants</div>
                        ) : product.inventoryTracking === false ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-slate-100 text-slate-800">Not Tracked</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{product.stock} in stock</span>
                            {isLowStock && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full
                          ${product.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                            product.status === 'DRAFT' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                            product.status === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-800 border-red-200' : 
                            'bg-slate-100 text-slate-800 border-slate-200'}`}>
                          {product.status ? product.status.replace(/_/g, ' ') : 'PUBLISHED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleDuplicate(product)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors" title="Duplicate">
                            <Copy className="w-4 h-4" />
                          </button>
                          <Link to={`/admin/products/${product.id}`} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          {product.status !== 'DISABLED' && (
                            <button onClick={() => handleArchive(product.id)} className="p-2 text-slate-400 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 rounded-lg transition-colors" title="Archive">
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(product.id, product.name)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
