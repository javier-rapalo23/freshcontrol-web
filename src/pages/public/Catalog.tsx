import { Filter, Search, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useProducts, type Product } from "../../hooks/useProducts";
import { useMemo } from "react";

// Datos de respaldo para DEMOSTRACIÓN VISUAL cuando no hay backend
const FALLBACK_PRODUCTS: any[] = [
  { id: 1, name: "Tomate Redondo", sell_price: 1500, category: { name: "Verduras" }, image: "🍅" },
  { id: 2, name: "Lechuga Mantecosa", sell_price: 800, category: { name: "Verduras" }, image: "🥬" },
  { id: 3, name: "Manzana Roja", sell_price: 2200, category: { name: "Frutas" }, image: "🍎" },
  { id: 4, name: "Banana", sell_price: 1800, category: { name: "Frutas" }, image: "🍌" },
  { id: 5, name: "Papa Negra", sell_price: 900, category: { name: "Verduras" }, image: "🥔" },
];

export default function Catalog() {
  const { products: apiProducts, loading, error } = useProducts();
  
  // Utilidad para asignar imagen según nombre (ya que el API no trae imagen)
  const getProductImage = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('tomate')) return "🍅";
    if (lower.includes('lechuga')) return "🥬";
    if (lower.includes('manzana')) return "🍎";
    if (lower.includes('banana')) return "🍌";
    if (lower.includes('papa')) return "🥔";
    if (lower.includes('naranja')) return "🍊";
    if (lower.includes('zanahoria')) return "🥕";
    if (lower.includes('palta')) return "🥑";
    return "📦";
  };

  const displayProducts = useMemo(() => {
    // Si la API trae datos, usarlos y enriquecer con imagen
    if (apiProducts.length > 0) {
      return apiProducts.map(p => ({
        ...p,
        image: getProductImage(p.name)
      }));
    }
    // Si hubo error, mostrar fallback
    if (error) return FALLBACK_PRODUCTS;
    return [];
  }, [apiProducts, error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nuestros Productos</h1>
          <p className="text-slate-600 mt-1">Encontrá lo mejor de la huerta</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Buscar productos..." 
                    className="w-full h-10 pl-9 pr-4 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>
            <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filtros
            </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-orange-50 border border-orange-200 text-orange-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">No se pudo conectar con el servidor. Mostrando catálogo de demostración.</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block col-span-3 space-y-8">
            <div>
                <h3 className="font-semibold mb-3 text-slate-900">Categorías</h3>
                <div className="space-y-2">
                    {['Todos', 'Frutas', 'Verduras', 'Orgánicos', 'Ofertas'].map((cat) => (
                        <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
                             <input type="checkbox" className="rounded border-slate-300 text-green-600 focus:ring-green-500" />
                             <span className="text-slate-600 group-hover:text-green-700">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-3 text-slate-900">Precio</h3>
                <div className="space-y-2">
                     <p className="text-sm text-slate-500">Rango de precios...</p>
                </div>
            </div>
        </aside>

        {/* Product Grid */}
        <div className="col-span-12 lg:col-span-9">
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayProducts.map((product) => (
                        <div key={product.id} className="group flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                            <div className="relative aspect-square bg-slate-50 flex items-center justify-center text-6xl">
                                {product.image || "📦"}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="text-xs text-green-600 font-medium mb-1">
                                    {product.category?.name || 'Varios'}
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1 truncate">{product.name}</h3>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-lg font-bold text-slate-900">${product.sell_price}</span>
                                    <Button size="sm" className="h-8 px-3 rounded-full">Agregar</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {!loading && displayProducts.length === 0 && !error && (
                <div className="text-center py-12 text-slate-500">
                    No hay productos disponibles.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
