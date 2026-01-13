import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X, Search, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useProducts, type Product } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import api from '../../lib/axios';

export default function ProductsScreen() {
  const { products, loading, error, refetch } = useProducts();
  const { categories } = useCategories();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: 0,
    buy_price: 0,
    sell_price: 0,
    unit: 'kg',
    stock: 0,
    active: true
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category_id: product.category_id || product.category?.id || 0,
        buy_price: product.buy_price,
        sell_price: product.sell_price,
        unit: product.unit,
        stock: product.stock,
        active: product.active
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category_id: categories[0]?.id || 0,
        buy_price: 0,
        sell_price: 0,
        unit: 'kg',
        stock: 0,
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
      await api.delete(`/productos/${id}`);
      refetch();
    } catch (error) {
      console.error('Error eliminando producto', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Preparar el objeto para enviar tal cual lo espera el backend (según swagger definitions/products.Product)
    const payload = {
       ...formData,
       category: { id: Number(formData.category_id) }, // Backend espera objeto o id? Swagger dice 'product' data, usualmente ids para relaciones
       category_id: Number(formData.category_id),
       buy_price: Number(formData.buy_price),
       sell_price: Number(formData.sell_price),
       stock: Number(formData.stock)
    };

    try {
      if (editingProduct) {
        await api.put(`/productos/${editingProduct.id}`, payload);
      } else {
        await api.post('/productos', payload);
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error guardando producto', error);
      alert('Error al guardar el producto. Ver consola para detalles.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Productos</h1>
          <p className="text-slate-600">Administra el inventario y precios</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Buscar por nombre o categoría..." 
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-slate-900 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
             <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
             </div>
        ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-900">Producto</th>
                  <th className="px-4 py-3 font-semibold text-slate-900">Categoría</th>
                  <th className="px-4 py-3 font-semibold text-slate-900 text-right">Precio Venta</th>
                  <th className="px-4 py-3 font-semibold text-slate-900 text-right">Stock</th>
                  <th className="px-4 py-3 font-semibold text-slate-900 text-center">Estado</th>
                  <th className="px-4 py-3 font-semibold text-slate-900 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {product.category?.name || 'Sin Categoría'}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-900">${product.sell_price}</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                        {product.stock} {product.unit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className={`h-2.5 w-2.5 rounded-full mx-auto ${product.active ? 'bg-green-500' : 'bg-red-400'}`} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleOpenModal(product)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Form Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 bg-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 bg-white"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: Number(e.target.value)})}
                  >
                    <option value={0}>Seleccionar...</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unidad</label>
                    <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 bg-white"
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    >
                        <option value="kg">Kilogramo (kg)</option>
                        <option value="unidad">Unidad</option>
                        <option value="manojo">Manojo</option>
                        <option value="bolsa">Bolsa</option>
                    </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio Compra</label>
                  <div className="relative">
                     <span className="absolute left-3 top-2 text-slate-500">$</span>
                     <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 bg-white"
                        value={formData.buy_price}
                        onChange={(e) => setFormData({...formData, buy_price: Number(e.target.value)})}
                     />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio Venta</label>
                  <div className="relative">
                     <span className="absolute left-3 top-2 text-slate-500">$</span>
                     <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 bg-white"
                        value={formData.sell_price}
                        onChange={(e) => setFormData({...formData, sell_price: Number(e.target.value)})}
                     />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 bg-white"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>

                 <div className="flex items-center h-full pt-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded text-green-600 focus:ring-green-500 h-4 w-4 border-slate-300"
                            checked={formData.active}
                            onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        />
                        <span className="text-sm font-medium text-slate-700">Producto Activo</span>
                    </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear Producto')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
