import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Truck, 
  ClipboardList 
} from "lucide-react";
import { Link } from "react-router-dom";

// Definimos los módulos del ERP
const modules = [
  {
    title: "Inventario",
    icon: Package,
    href: "/admin/productos",
    description: "Gestión de productos, stock, precios y categorías.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Ventas",
    icon: ShoppingCart,
    href: "/ventas", 
    description: "Punto de venta, caja y registro de pedidos.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Compras",
    icon: Truck,
    href: "/compras", 
    description: "Gestión de proveedores, órdenes y recepción.",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/clientes", 
    description: "Directorio de clientes y estados de cuenta.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Reportes",
    icon: BarChart3,
    href: "/reportes", 
    description: "Análisis financiero, movimientos y estadísticas.",
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/configuracion", 
    description: "Usuarios, roles y parámetros del sistema.",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header del Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
        <p className="text-slate-600 mt-2">Bienvenido al sistema de gestión FreshControl.</p>
      </div>

      {/* Quick Stats (Ejemplo estático) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[ 
          { label: "Ventas hoy", value: "$ 1,250.00", icon: LayoutDashboard, color: "text-green-600" },
          { label: "Pedidos Pendientes", value: "12", icon: ClipboardList, color: "text-orange-600" },
          { label: "Bajo Stock", value: "5 Productos", icon: Package, color: "text-red-600" },
          { label: "Clientes Activos", value: "128", icon: Users, color: "text-blue-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link 
            key={module.title} 
            to={module.href}
            className="group relative block p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-green-200 transition-all duration-200"
          >
            <div className={`inline-flex p-3 rounded-lg ${module.bgColor} ${module.color} mb-4 group-hover:scale-110 transition-transform`}>
              <module.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 group-hover:text-green-700 transition-colors">
              {module.title}
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              {module.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
