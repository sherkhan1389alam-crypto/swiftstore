content = """import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Category } from '../../lib/types';
import { Plus, Edit, Trash2, Loader2, X, Image as ImageIcon, Camera } from 'lucide-react';
import { compressImage } from '../../lib/imageUtils';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'ENABLED' | 'DISABLED'>('ENABLED');
  const [order, setOrder] = useState(0);
  const [featured, setFeatured] = useState(false);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const catsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      catsData.sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(catsData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setStatus('ENABLED');
    setFeatured(false);
    setOrder(categories.length > 0 ? (categories[categories.length - 1].order || 0) + 10 : 0);
    setShowAddModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setImageUrl(category.imageUrl || '');
    setStatus(category.status || 'ENABLED');
    setOrder(category.order || 0);
    setFeatured(category.featured || false);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this category?")) {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSaving(true);
    try {
      const compressedDataUrl = await compressImage(file);
      setImageUrl(compressedDataUrl);
    } catch (error) {
      console.error('Image compression failed', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const catData = { 
        name, 
        description, 
        imageUrl, 
        status, 
        order,
        featured
      };
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), catData);
      } else {
        await addDoc(collection(db, 'categories'), catData);
      }
      
      setShowAddModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category', error);
      alert('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Category Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors shadow-sm text-sm font-bold uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-slate-300" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 inline-flex text-[10px] uppercase font-bold tracking-wider rounded-sm ${category.status === 'DISABLED' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-800'}`}>
                      {category.status === 'DISABLED' ? 'Disabled' : 'Active'}
                    </span>
                    {category.featured && (
                      <span className="px-2 py-0.5 inline-flex text-[10px] uppercase font-bold tracking-wider rounded-sm bg-indigo-100 text-indigo-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(category)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm font-semibold flex items-center gap-1">
                  <Edit className="h-4 w-4" /> Edit
                </button>
                <button onClick={() => handleDelete(category.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold flex items-center gap-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}

          {categories.length === 0 && (
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 border-dashed">
              No categories found. Create your first category to get started.
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="categoryForm" onSubmit={handleSaveCategory} className="space-y-6">
                
                {/* Category Image */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Category Image</label>
                  
                  {imageUrl ? (
                    <div className="relative aspect-[16/9] md:aspect-[3/1] rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
                      <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                        <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-100 transition-colors">
                          <Camera className="w-4 h-4" /> Replace
                          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} disabled={saving} />
                        </label>
                        <button type="button" onClick={handleRemoveImage} className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {saving ? (
                           <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
                        ) : (
                          <>
                            <Camera className="w-8 h-8 text-slate-400 mb-2 group-hover:text-slate-600 transition-colors" />
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Upload Image</p>
                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP</p>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} disabled={saving} />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Category Name *</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Beauty" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors" placeholder="Brief description (optional)" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors">
                      <option value="ENABLED">Active</option>
                      <option value="DISABLED">Disabled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Display Order</label>
                    <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={featured} 
                    onChange={e => setFeatured(e.target.checked)} 
                    className="w-5 h-5 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                  />
                  <div>
                    <label htmlFor="featured" className="text-sm font-bold text-slate-900 select-none">Mark as Featured Category</label>
                    <p className="text-xs text-slate-500">Highlight this category on the homepage</p>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex justify-end space-x-3">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button form="categoryForm" type="submit" disabled={saving} className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""

with open("src/pages/admin/Categories.tsx", "w") as f:
    f.write(content)
