import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/public/Home";
import Catalog from "./pages/public/Catalog";
import ProductsScreen from "./pages/inventory/ProductsScreen";
import CategoriesScreen from "./pages/inventory/CategoriesScreen";

// Placeholder components
const NotFound = () => <div className="p-8 text-center text-2xl">404 - Página no encontrada</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalog />} />
        
        {/* Módulos ERP Placeholders */}
        <Route path="ventas" element={<div className="p-8 text-center">Módulo de Ventas (Próximamente)</div>} />
        <Route path="compras" element={<div className="p-8 text-center">Módulo de Compras (Próximamente)</div>} />
        <Route path="clientes" element={<div className="p-8 text-center">Gestión de Clientes (Próximamente)</div>} />
        <Route path="reportes" element={<div className="p-8 text-center">Reportes y Estadísticas (Próximamente)</div>} />
        <Route path="configuracion" element={<div className="p-8 text-center">Configuración del Sistema (Próximamente)</div>} />

        <Route path="nosotros" element={<div className="p-8 text-center">Página Nosotros (En construcción)</div>} />
        <Route path="carrito" element={<div className="p-8 text-center">Carrito de Compras (En construcción)</div>} />
        <Route path="login" element={<div className="p-8 text-center">Login (En construcción)</div>} />
        <Route path="registro" element={<div className="p-8 text-center">Registro (En construcción)</div>} />
        
        {/* Rutas de Administración (Temporalmente aquí) */}
        <Route path="admin/productos" element={<ProductsScreen />} />
        <Route path="admin/categorias" element={<CategoriesScreen />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
