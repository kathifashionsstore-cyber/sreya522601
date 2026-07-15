import { useState, useMemo } from 'react'
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle, 
  FileText, 
  Eye, 
  EyeOff, 
  Settings as SettingsIcon, 
  Tag, 
  FolderOpen, 
  TrendingUp, 
  Calendar,
  Grid,
  MapPin,
  RefreshCw,
  Search
} from 'lucide-react'
import { useFirestoreCollection, saveDocument, updateDocument } from '../hooks/useFirestoreCollection'
import { gallery as fallbackGallery } from '../data/seed'
import { useToast } from '../components/shared/Toast'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/shared/Button'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { ImageUploadField } from '../components/admin/ImageUploadField'


const ALBUMS = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'doctors', label: 'Doctors' },
  { value: 'operation-theatre', label: 'Operation Theatre' },
  { value: 'lab', label: 'Lab' },
  { value: 'reception', label: 'Reception' },
  { value: 'rooms', label: 'Rooms' },
  { value: 'events', label: 'Events' },
  { value: 'medical-camp', label: 'Medical Camp' },
  { value: 'awards', label: 'Awards' },
  { value: 'patient-awareness', label: 'Patient Awareness' },
  { value: 'success-stories', label: 'Success Stories' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'videos', label: 'Videos' }
]

const CATEGORIES = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'doctors', label: 'Doctors' },
  { value: 'lab', label: 'Lab' },
  { value: 'ivf', label: 'IVF' },
  { value: 'success-stories', label: 'Success Stories' },
  { value: 'events', label: 'Events' },
  { value: 'counselling', label: 'Counselling' },
  { value: 'awards', label: 'Awards' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'medical-camp', label: 'Medical Camp' },
  { value: 'videos', label: 'Videos' }
]

export default function AdminGallery() {
  const { data: dbGallery } = useFirestoreCollection('gallery', fallbackGallery, 'order', true)
  const items = dbGallery || fallbackGallery
  const { push } = useToast()
  const { user } = useAuth()

  // Tabs navigation
  const [activeTab, setActiveTab] = useState('dashboard')

  // Form State for editing or adding
  const emptyForm = {
    title: '',
    imageUrl: '',
    shortDescription: '',
    category: 'hospital',
    album: 'hospital',
    date: new Date().toISOString().split('T')[0],
    location: 'Sreya Hospitals, Narasaraopet',
    photographer: '',
    tags: '',
    altText: '',
    seoTitle: '',
    seoDescription: '',
    featured: false,
    homepage: true,
    status: 'published',
    order: items.length + 1,
    active: true
  }

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterAlbum, setFilterAlbum] = useState('all')

  // Bulk selections
  const [selectedIds, setSelectedIds] = useState([])
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)

  // Settings mock state
  const [settings, setSettings] = useState({
    autoWebP: true,
    maxWidth: 1600,
    compressionLevel: 80,
    enforceSEO: false
  })

  // Computed dashboard stats
  const stats = useMemo(() => {
    const activeItems = items.filter(item => !item.deletedAt)
    const published = activeItems.filter(item => item.status === 'published').length
    const drafts = activeItems.filter(item => item.status === 'draft').length
    const featured = activeItems.filter(item => item.featured).length
    const homepage = activeItems.filter(item => item.homepage).length
    
    // Count distinct albums
    const uniqueAlbums = new Set(activeItems.map(item => item.album).filter(Boolean))

    return {
      total: activeItems.length,
      published,
      drafts,
      featured,
      homepage,
      albumsCount: uniqueAlbums.size
    }
  }, [items])

  // Filtered items list
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (item.deletedAt) return false
      
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.tags?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory
      const matchesAlbum = filterAlbum === 'all' || item.album === filterAlbum
      
      return matchesSearch && matchesCategory && matchesAlbum
    })
  }, [items, searchTerm, filterCategory, filterAlbum])

  // Toggle selection
  const handleSelectToggle = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map(item => item.id))
    } else {
      setSelectedIds([])
    }
  }

  // Save/Update item handler
  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.imageUrl) {
      push('Please provide an Image URL.', 'error')
      return
    }

    try {
      const payload = {
        ...form,
        updatedBy: user?.email || 'admin',
        updatedAt: new Date().toISOString()
      }

      if (editingId) {
        await updateDocument('gallery', editingId, payload)
        push('Gallery image updated successfully.', 'success')
      } else {
        await saveDocument('gallery', payload)
        push('Gallery image added successfully.', 'success')
      }

      // Reset form and go back to All Images tab
      setForm(emptyForm)
      setEditingId(null)
      setActiveTab('manage')
    } catch (error) {
      push(error.message || 'Error saving image.', 'error')
    }
  }

  // Delete single item
  const handleDeleteSingle = async () => {
    if (!deleteConfirmId) return
    try {
      await updateDocument('gallery', deleteConfirmId, {
        deletedAt: new Date().toISOString(),
        updatedBy: user?.email || 'admin'
      })
      push('Image moved to Recently Deleted.', 'success')
      setDeleteConfirmId(null)
    } catch (error) {
      push(error.message || 'Could not delete.', 'error')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => 
        updateDocument('gallery', id, {
          deletedAt: new Date().toISOString(),
          updatedBy: user?.email || 'admin'
        })
      ))
      push(`Successfully deleted ${selectedIds.length} items.`, 'success')
      setSelectedIds([])
      setBulkDeleteConfirm(false)
    } catch (error) {
      push(error.message || 'Error during bulk deletion.', 'error')
    }
  }

  const handleBulkPublish = async (statusVal) => {
    try {
      await Promise.all(selectedIds.map(id => 
        updateDocument('gallery', id, {
          status: statusVal,
          updatedBy: user?.email || 'admin'
        })
      ))
      push(`Successfully set status to ${statusVal} for ${selectedIds.length} items.`, 'success')
      setSelectedIds([])
    } catch (error) {
      push(error.message || 'Error updating status.', 'error')
    }
  }

  // Edit action
  const handleEditClick = (item) => {
    setForm(item)
    setEditingId(item.id)
    setActiveTab('add')
  }

  return (
    <div className="space-y-6 text-left">
      {/* Friendly Compression Guideline Banner */}
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 shadow-soft">
        <div className="flex gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h3 className="text-sm font-black text-teal-900 uppercase tracking-wider">
              Gallery Image Optimizations
            </h3>
            <p className="mt-1 text-xs text-teal-800 leading-relaxed font-semibold">
              To guarantee seamless performance on the Apple-style masonry layout, upload images under <strong>300KB</strong> compressed to <strong>WebP</strong> format with dimensions within 1600px width.
            </p>
          </div>
        </div>
      </div>

      {/* Main Header Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-navy flex items-center gap-2">
            <ImageIcon className="size-8 text-[#3F8F84]" /> Gallery Manager
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 font-bold">
            Create albums, toggle visibility on the homepage, and upload miracle moment captures.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 rounded-lg p-1 text-xs font-black">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'manage', label: 'All Images', icon: Grid },
            { id: 'add', label: editingId ? 'Edit Image' : 'Add Image', icon: Plus },
            { id: 'albums', label: 'Albums Filter', icon: FolderOpen },
            { id: 'settings', label: 'Settings', icon: SettingsIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (tab.id !== 'add') {
                  setEditingId(null)
                  setForm(emptyForm)
                }
              }}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#3F8F84] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl bg-white p-5 shadow-soft border border-slate-100">
              <ImageIcon className="size-7 text-[#3F8F84]" />
              <p className="mt-4 text-3xl font-black text-brand-navy">{stats.total}</p>
              <p className="text-xs font-bold text-slate-500">Total Images</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-soft border border-slate-100">
              <CheckCircle className="size-7 text-emerald-500" />
              <p className="mt-4 text-3xl font-black text-brand-navy">{stats.published}</p>
              <p className="text-xs font-bold text-slate-500">Published</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-soft border border-slate-100">
              <FileText className="size-7 text-amber-500" />
              <p className="mt-4 text-3xl font-black text-brand-navy">{stats.drafts}</p>
              <p className="text-xs font-bold text-slate-500">Drafts</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-soft border border-slate-100">
              <FolderOpen className="size-7 text-sky-500" />
              <p className="mt-4 text-3xl font-black text-brand-navy">{stats.albumsCount}</p>
              <p className="text-xs font-bold text-slate-500">Active Albums</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-soft border border-slate-100">
              <TrendingUp className="size-7 text-purple-500" />
              <p className="mt-4 text-3xl font-black text-brand-navy">{stats.homepage}</p>
              <p className="text-xs font-bold text-slate-500">On Homepage</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Actions Panel */}
            <div className="rounded-xl bg-white p-5 shadow-soft border border-slate-100 space-y-4">
              <h2 className="text-base font-black text-brand-navy uppercase tracking-wider">Quick Actions</h2>
              <div className="grid gap-3">
                <button
                  onClick={() => setActiveTab('add')}
                  className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-[#3F8F84] hover:bg-[#F5F9F8]/20 transition text-left text-xs font-bold text-slate-700"
                >
                  <span>Upload a New Gallery Image</span>
                  <Plus className="size-4 text-[#3F8F84]" />
                </button>
                <button
                  onClick={() => setActiveTab('albums')}
                  className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-[#3F8F84] hover:bg-[#F5F9F8]/20 transition text-left text-xs font-bold text-slate-700"
                >
                  <span>Configure Albums and Categories</span>
                  <FolderOpen className="size-4 text-sky-500" />
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="rounded-xl bg-white p-5 shadow-soft border border-slate-100 space-y-3">
              <h2 className="text-base font-black text-brand-navy uppercase tracking-wider">Aesthetic Guidelines</h2>
              <ul className="text-xs text-slate-600 leading-relaxed list-disc list-inside space-y-1.5 font-medium">
                <li>Images on the homepage appear in an infinite reflection marquee.</li>
                <li>Tagging images with correct categories updates respective page flows automatically.</li>
                <li>Draft status keeps files hidden from public view for approval.</li>
                <li>Add descriptive alt texts to boost SEO indexing on medical searches.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ADD / EDIT IMAGE FORM */}
      {activeTab === 'add' && (
        <form onSubmit={handleSave} className="bg-white rounded-xl p-6 shadow-soft border border-slate-100 space-y-6">
          <h2 className="text-lg font-black text-brand-navy">
            {editingId ? 'Modify Gallery Item' : 'Add New Gallery Item'}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Image / Video Upload</label>
              <ImageUploadField
                value={form.imageUrl}
                onChange={url => setForm({ ...form, imageUrl: url })}
                label="Gallery Image"
              />
            </div>


            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Title</label>
              <input
                type="text"
                required
                placeholder="IVF Laboratory Bench"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Short Description</label>
              <textarea
                rows={3}
                placeholder="Brief summary displayed on the card overlay..."
                value={form.shortDescription}
                onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Album</label>
              <select
                value={form.album}
                onChange={e => setForm({ ...form, album: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              >
                {ALBUMS.map(alb => (
                  <option key={alb.value} value={alb.value}>{alb.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Capture Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Location</label>
              <input
                type="text"
                placeholder="Sreya Hospitals, Narasaraopet"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Photographer</label>
              <input
                type="text"
                placeholder="Hospital Staff"
                value={form.photographer}
                onChange={e => setForm({ ...form, photographer: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="OT, Microscope, Team"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>
          </div>

          {/* Display & SEO Toggles */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Display Settings & SEO</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex items-center gap-2 p-3.5 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm({ ...form, featured: e.target.checked })}
                  className="accent-[#3F8F84] size-4"
                />
                <span className="text-xs font-bold text-slate-700">Featured Image</span>
              </label>

              <label className="flex items-center gap-2 p-3.5 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={form.homepage}
                  onChange={e => setForm({ ...form, homepage: e.target.checked })}
                  className="accent-[#3F8F84] size-4"
                />
                <span className="text-xs font-bold text-slate-700">Show on Homepage</span>
              </label>

              <div className="flex items-center gap-2 p-3 border border-slate-100 rounded-lg bg-slate-50">
                <span className="text-xs font-bold text-slate-700 mr-2">Status:</span>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="rounded border border-slate-200 bg-white p-1 text-xs focus:outline-none focus:border-[#3F8F84]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase text-slate-700">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  placeholder="Alt text detailing what is in the photo..."
                  value={form.altText}
                  onChange={e => setForm({ ...form, altText: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase text-slate-700">SEO Meta Title</label>
                <input
                  type="text"
                  placeholder="Advanced IVF Laboratory Narasaraopet"
                  value={form.seoTitle}
                  onChange={e => setForm({ ...form, seoTitle: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setForm(emptyForm)
                setEditingId(null)
                setActiveTab('manage')
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? 'Save Changes' : 'Upload Image'}
            </Button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: MANAGE IMAGES TABLE */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid gap-3 sm:grid-cols-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>

            <select
              value={filterAlbum}
              onChange={e => setFilterAlbum(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
            >
              <option value="all">All Albums</option>
              {ALBUMS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>

            {/* Bulk Actions Button bar */}
            {selectedIds.length > 0 && (
              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="!px-3 !py-1 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => handleBulkPublish('published')}
                >
                  Publish Selected
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="!px-3 !py-1 text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => handleBulkPublish('draft')}
                >
                  Draft Selected
                </Button>
                <Button 
                  type="button" 
                  className="!px-3 !py-1 text-xs bg-red-600 hover:bg-red-700"
                  onClick={() => setBulkDeleteConfirm(true)}
                >
                  <Trash2 className="size-3.5" /> ({selectedIds.length})
                </Button>
              </div>
            )}
          </div>

          {/* Table List */}
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft">
            {filteredItems.length > 0 ? (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={selectedIds.length === filteredItems.length && filteredItems.length > 0} 
                      />
                    </th>
                    <th className="p-4">Thumbnail</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Album</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Homepage</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectToggle(item.id)}
                        />
                      </td>
                      <td className="p-4">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="size-11 object-cover rounded-lg border border-slate-200" 
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800">{item.title}</div>
                        {item.date && (
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="size-3" /> {item.date}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700">
                          {item.album}
                        </span>
                      </td>
                      <td className="p-4">
                        {item.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <Eye className="size-3.5" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            <EyeOff className="size-3.5" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {item.featured ? '⭐️ Yes' : '—'}
                      </td>
                      <td className="p-4 text-center">
                        {item.homepage ? '📱 Yes' : '—'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="rounded bg-slate-100 px-2 py-1 font-bold text-slate-700 hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="rounded bg-red-50 px-2 py-1 font-bold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400">
                No matching images found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ALBUMS GRID */}
      {activeTab === 'albums' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ALBUMS.map(album => {
              const albumItemsCount = items.filter(item => !item.deletedAt && item.album === album.value).length
              const albumCover = items.find(item => !item.deletedAt && item.album === album.value)?.imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'

              return (
                <div 
                  key={album.value} 
                  onClick={() => {
                    setFilterAlbum(album.value)
                    setActiveTab('manage')
                  }}
                  className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-soft cursor-pointer hover:-translate-y-1 transition duration-200 group"
                >
                  <div className="h-32 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={albumCover} 
                      alt={album.label} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                  <div className="p-4 flex justify-between items-center bg-white">
                    <div>
                      <h3 className="font-extrabold text-slate-800">{album.label}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">{album.value} album</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-[#3F8F84]">
                      {albumItemsCount}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-100 space-y-6">
          <h2 className="text-lg font-black text-brand-navy flex items-center gap-1.5">
            <SettingsIcon className="size-5 text-[#3F8F84]" /> Gallery Upload Settings
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2 max-w-xl">
            <label className="flex items-center justify-between p-4 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <div>
                <span className="block text-xs font-extrabold text-slate-800">Auto Convert to WebP</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Compress uploaded files locally to save space.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoWebP}
                onChange={e => setSettings({ ...settings, autoWebP: e.target.checked })}
                className="accent-[#3F8F84] size-4"
              />
            </label>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Enforce Max Width (px)</label>
              <input
                type="number"
                value={settings.maxWidth}
                onChange={e => setSettings({ ...settings, maxWidth: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Compression Target (%)</label>
              <input
                type="number"
                min={50}
                max={100}
                value={settings.compressionLevel}
                onChange={e => setSettings({ ...settings, compressionLevel: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>

            <label className="flex items-center justify-between p-4 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <div>
                <span className="block text-xs font-extrabold text-slate-800">Enforce SEO Fields</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Require meta tags before publishing.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enforceSEO}
                onChange={e => setSettings({ ...settings, enforceSEO: e.target.checked })}
                className="accent-[#3F8F84] size-4"
              />
            </label>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOGS */}
      <ConfirmDialog
        open={deleteConfirmId !== null}
        title="Delete Image"
        description="Are you sure you want to move this image to recently deleted? It can be restored from firestore backend if needed."
        confirmLabel="Move to Deleted"
        onConfirm={handleDeleteSingle}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <ConfirmDialog
        open={bulkDeleteConfirm}
        title="Bulk Delete Images"
        description={`Are you sure you want to delete all ${selectedIds.length} selected images?`}
        confirmLabel="Bulk Delete"
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  )
}
