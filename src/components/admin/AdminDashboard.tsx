import React, { useState, useEffect } from 'react';
import {
  Flame, LayoutDashboard, Utensils, FolderTree, Settings, Palette,
  Clock, Share2, Search, Shield, Database, FileText, LogOut, Plus,
  Trash2, Edit, Save, RefreshCw, Download, Upload, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { FullAppDatabase, Product, Category, ScheduleItem } from '../../types';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'categories'
    | 'settings'
    | 'theme'
    | 'schedules'
    | 'socials'
    | 'seo'
    | 'security'
    | 'backup'
    | 'docs'
  >('overview');

  const [dbData, setDbData] = useState<FullAppDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form states
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [newProdCategory, setNewProdCategory] = useState<string>('');

  const fetchFullData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/full-data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDbData(data.data);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullData();
  }, []);

  const triggerNotify = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // Product CRUD Handlers
  const handleSaveProduct = async () => {
    if (!editingProduct || !editingProduct.name) return;

    const isNew = !editingProduct.id;
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${editingProduct.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        triggerNotify(isNew ? 'Nuevo plato guardado con éxito' : 'Plato actualizado correctamente');
        setEditingProduct(null);
        fetchFullData();
      }
    } catch (err) {
      triggerNotify('Error al guardar el plato');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        triggerNotify('Producto eliminado');
        fetchFullData();
      }
    } catch (err) {
      triggerNotify('Error al eliminar');
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbData) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dbData.settings),
      });
      const data = await res.json();
      if (data.success) {
        triggerNotify('Configuración del restaurante guardada');
      }
    } catch (err) {
      triggerNotify('Error al guardar configuración');
    }
  };

  // Seed Reset Handler
  const handleResetSeed = async () => {
    if (!confirm('¿Restaurar la base de datos completa al estado Semilla oficial? Esto sobrescribirá los datos actuales.')) return;
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        triggerNotify('Base de datos restaurada al estado Semilla oficial');
        fetchFullData();
      }
    } catch (err) {
      triggerNotify('Error al reiniciar base de datos');
    }
  };

  if (loading || !dbData) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white space-y-4">
        <Flame className="w-10 h-10 text-[#E61E2A] animate-spin" />
        <span className="text-xs font-black tracking-widest uppercase">Cargando Panel de Control CMS...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#0a0a0a] border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E61E2A] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(230,30,42,0.4)]">
              <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#E61E2A] animate-pulse" />
              </div>
            </div>
            <div>
              <span className="block text-base font-black text-white uppercase tracking-tighter">
                DRAGÓN ROJO
              </span>
              <span className="block text-[9px] text-[#FF9F1C] font-mono uppercase tracking-widest">PANEL ADMINISTRATIVO</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'overview' ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Visión General</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'products' ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Gestión de Platos</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'categories' ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categorías</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'settings' ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Datos del Restaurante</span>
            </button>

            <button
              onClick={() => setActiveTab('schedules')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'schedules' ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Horarios y Feriados</span>
            </button>

            <button
              onClick={() => setActiveTab('socials')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'socials' ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Redes Sociales</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'security' ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Seguridad y Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'backup' ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Respaldos y Semilla</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'docs' ? 'bg-[#E61E2A] text-white shadow-[0_0_15px_rgba(230,30,42,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Documentación Técnica</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <a
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/80 text-xs font-black uppercase tracking-widest border border-white/10 hover:text-white hover:bg-white/10 transition-all"
          >
            Ver Sitio Público
          </a>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-950/40 text-red-400 text-xs font-black uppercase tracking-widest border border-red-500/30 hover:bg-red-900/40 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        {/* Top Header & Alert Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">
              {activeTab === 'overview' && 'Visión General del Sistema'}
              {activeTab === 'products' && 'Gestor de Menú y Platos al Carbón'}
              {activeTab === 'categories' && 'Categorías del Menú'}
              {activeTab === 'settings' && 'Información e Identidad del Restaurante'}
              {activeTab === 'schedules' && 'Horarios y Avisos de Feriados'}
              {activeTab === 'socials' && 'Redes Sociales y WhatsApp'}
              {activeTab === 'security' && 'Auditoría de Seguridad y Accesos'}
              {activeTab === 'backup' && 'Respaldos JSON y Restauración'}
              {activeTab === 'docs' && 'Manual de Arquitectura y Documentación Técnica'}
            </h1>
            <p className="text-xs text-white/50 font-light">
              Gestión centralizada para la plataforma web de Dragón Rojo
            </p>
          </div>

          {saveStatus && (
            <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveStatus}</span>
            </div>
          )}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-xl bg-[#0a0a0a] border border-white/10 space-y-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Platos Registrados</span>
                <span className="text-3xl font-black text-white block">{dbData.products.length}</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">100% Administrables</span>
              </div>

              <div className="p-5 rounded-xl bg-[#0a0a0a] border border-white/10 space-y-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Categorías Activas</span>
                <span className="text-3xl font-black text-[#FF9F1C] block">{dbData.categories.length}</span>
                <span className="text-[10px] text-white/40 font-light">Parrilla, Caldos, Masería</span>
              </div>

              <div className="p-5 rounded-xl bg-[#0a0a0a] border border-white/10 space-y-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Modo de Atención</span>
                <span className="text-lg font-black text-[#E61E2A] uppercase block">Exclusivo Presencial</span>
                <span className="text-[10px] text-white/40 font-light">Sábados, Dom y Feriados</span>
              </div>

              <div className="p-5 rounded-xl bg-[#0a0a0a] border border-white/10 space-y-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Estado Base de Datos</span>
                <span className="text-lg font-black text-emerald-400 uppercase block">Sincronizado</span>
                <span className="text-[10px] text-white/40 font-light">Versión {dbData.version}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-tight">Últimos Eventos de Auditoría</h3>
              <div className="space-y-2">
                {dbData.auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 rounded-lg bg-[#050505] border border-white/5 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-black text-[#FF9F1C] uppercase tracking-wider">{log.action}</span>
                      <p className="text-[11px] text-white/60 font-light">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-white/30 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white uppercase tracking-tight">Listado de Platos Culinarios</h3>
              <button
                onClick={() =>
                  setEditingProduct({
                    name: '',
                    slug: `nuevo-plato-${Date.now()}`,
                    categoryId: dbData.categories[0]?.id || 'cat-cuy',
                    description: '',
                    history: '',
                    price: 12.00,
                    isCombo: false,
                    isFeatured: false,
                    isPopular: true,
                    isNew: true,
                    prepTime: '15 min',
                    ingredients: ['Ingrediente 1', 'Ingrediente 2'],
                    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
                    gallery: [],
                    availability: true,
                    spicyLevel: 0,
                    status: 'active',
                    order: dbData.products.length + 1,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(230,30,42,0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nuevo Plato</span>
              </button>
            </div>

            {/* Product Edit Modal / Drawer */}
            {editingProduct && (
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-[#FF9F1C]/40 space-y-4 animate-fadeIn">
                <h4 className="text-base font-black text-[#FF9F1C] uppercase tracking-tight">
                  {editingProduct.id ? 'Editar Plato Culinario' : 'Crear Nuevo Plato'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Nombre del Plato</label>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Categoría</label>
                    <select
                      value={editingProduct.categoryId || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white"
                    >
                      {dbData.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Precio ($)</label>
                    <input
                      type="number"
                      step="0.50"
                      value={editingProduct.price || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                      className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Tiempo de Preparación</label>
                    <input
                      type="text"
                      value={editingProduct.prepTime || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, prepTime: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Descripción</label>
                    <textarea
                      rows={2}
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white font-light"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Historia y Tradición Ancestral</label>
                    <textarea
                      rows={2}
                      value={editingProduct.history || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, history: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white font-light"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-black text-white/60 uppercase tracking-widest block mb-1">URL de la Imagen</label>
                    <input
                      type="text"
                      value={editingProduct.imageUrl || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-lg bg-[#050505] text-white/60 hover:text-white text-xs font-black uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest shadow-lg"
                  >
                    Guardar Plato
                  </button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-[#050505] text-white/40 uppercase font-black border-b border-white/10 tracking-widest">
                  <tr>
                    <th className="p-4">Plato</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dbData.products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-black text-white uppercase flex items-center gap-3 tracking-tight">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover contrast-110" />
                        <span>{p.name}</span>
                      </td>
                      <td className="p-4 text-white/60">{dbData.categories.find((c) => c.id === p.categoryId)?.name || p.categoryId}</td>
                      <td className="p-4 font-black text-[#E61E2A]">${p.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#FF9F1C]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS FORM */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-base font-black text-white uppercase tracking-tight">Información Principal del Restaurante</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={dbData.settings.name}
                  onChange={(e) => setDbData({ ...dbData, settings: { ...dbData.settings, name: e.target.value } })}
                  className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Eslogan Comercial</label>
                <input
                  type="text"
                  value={dbData.settings.slogan}
                  onChange={(e) => setDbData({ ...dbData, settings: { ...dbData.settings, slogan: e.target.value } })}
                  className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white font-light"
                />
              </div>

              <div>
                <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Teléfono Principal</label>
                <input
                  type="text"
                  value={dbData.settings.phone}
                  onChange={(e) => setDbData({ ...dbData, settings: { ...dbData.settings, phone: e.target.value } })}
                  className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="font-black text-white/60 uppercase tracking-widest block mb-1">WhatsApp de Atención</label>
                <input
                  type="text"
                  value={dbData.settings.whatsapp}
                  onChange={(e) => setDbData({ ...dbData, settings: { ...dbData.settings, whatsapp: e.target.value } })}
                  className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Dirección Completa</label>
                <input
                  type="text"
                  value={dbData.settings.address}
                  onChange={(e) => setDbData({ ...dbData, settings: { ...dbData.settings, address: e.target.value } })}
                  className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="font-black text-white/60 uppercase tracking-widest block mb-1">Aviso Destacado de Atención Presencial</label>
                <textarea
                  rows={2}
                  value={dbData.settings.noticeText}
                  onChange={(e) => setDbData({ ...dbData, settings: { ...dbData.settings, noticeText: e.target.value } })}
                  className="w-full p-2.5 rounded-lg bg-[#050505] border border-white/10 text-white font-light"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(230,30,42,0.3)] flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </form>
        )}

        {/* TAB 8: BACKUPS & SEED */}
        {activeTab === 'backup' && (
          <div className="space-y-6 max-w-2xl bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-base font-black text-white uppercase tracking-tight">Gestor de Respaldos e Inicialización</h3>

            <div className="p-4 rounded-xl bg-[#050505] border border-white/10 space-y-3 text-xs">
              <h4 className="font-black text-[#FF9F1C] uppercase tracking-widest">Exportar Respaldo de Base de Datos (JSON)</h4>
              <p className="text-white/60 font-light">Descarga una copia completa de las colecciones, platos, categorías y configuraciones.</p>
              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dbData, null, 2))}`}
                download={`dragon_rojo_backup_${new Date().toISOString().slice(0, 10)}.json`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest transition-all"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Descargar Archivo JSON</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 space-y-3 text-xs">
              <h4 className="font-black text-[#E61E2A] uppercase tracking-widest">Restaurar Datos Oficiales Semilla</h4>
              <p className="text-white/70 font-light">Si deseas reiniciar la carta y platos al estado original certificado por Dragón Rojo.</p>
              <button
                onClick={handleResetSeed}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E61E2A] hover:bg-[#c71823] text-white font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(230,30,42,0.3)]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Restaurar Base Semilla</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 10: INTEGRATED TECHNICAL DOCUMENTATION */}
        {activeTab === 'docs' && (
          <div className="space-y-6 bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl text-xs leading-relaxed text-white/80">
            <h2 className="text-xl font-black text-white uppercase tracking-tight border-b border-white/10 pb-4">
              DOCUMENTACIÓN TÉCNICA OFICIAL Y MANUAL DE ARQUITECTURA
            </h2>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <section className="space-y-2">
                <h3 className="text-xs font-black text-[#FF9F1C] uppercase tracking-widest">1. DOCUMENTO DE ARQUITECTURA</h3>
                <p className="font-light">
                  Aplicación Full-Stack con arquitectura desacoplada basada en React 19 + TypeScript + Vite en el Frontend y Node.js + Express en el Backend. Gestión de estado persistente mediante motor JSON/Firestore local sincronizado en tiempo real.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-black text-[#FF9F1C] uppercase tracking-widest">2. DOCUMENTO TÉCNICO Y STACK</h3>
                <p className="font-light">
                  Tecnologías empleadas: React 19, TypeScript 5, Vite 6, Express 4, JWT, Tailwind CSS 4, Motion/React, FontAwesome/Lucide Icons, Google GenAI SDK.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-black text-[#FF9F1C] uppercase tracking-widest">3. MODELO FIRESTORE Y COLECCIONES</h3>
                <p className="font-light">
                  Colecciones configuradas: settings, categories, products, offers, schedules, testimonials, gallery, faqs, socialLinks, seoMetadata, auditLogs, securityLogs.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-black text-[#FF9F1C] uppercase tracking-widest">4. REGLAS DE SEGURIDAD FIRESTORE & STORAGE</h3>
                <pre className="p-3 rounded-lg bg-[#050505] font-mono text-[11px] text-[#FF9F1C] border border-white/10">
                  {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'SUPER_ADMIN';
    }
  }
}`}
                </pre>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-black text-[#FF9F1C] uppercase tracking-widest">5. RUTAS Y ENDPOINTS API</h3>
                <ul className="list-disc pl-5 space-y-1 text-white/70 font-light">
                  <li><code>GET /api/public/data</code>: Datos públicos del restaurante</li>
                  <li><code>POST /api/auth/login</code>: Inicio de sesión de administración</li>
                  <li><code>POST /api/auth/verify-pin</code>: Verificación 2FA con PIN de 6 dígitos</li>
                  <li><code>POST /api/gemini/dish-story</code>: Generador de historias culinarias con Gemini AI</li>
                  <li><code>PUT /api/admin/settings</code>: Actualización de datos del restaurante</li>
                  <li><code>POST /api/admin/products</code>: Creación y edición de platos</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-black text-[#FF9F1C] uppercase tracking-widest">6. MANUAL DEL ADMINISTRADOR</h3>
                <p className="font-light">
                  Para ingresar al panel de administración ingrese directamente a la ruta secreta <code>/dragonrojoec</code> en su navegador. Ingrese sus credenciales y valide el PIN temporal.
                </p>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
