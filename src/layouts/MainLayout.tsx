import { Outlet, Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Sprout } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { navigation } from "../lib/navigation";
import { cn } from "../lib/utils";

export default function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Fresh<span className="text-green-600">Control</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-green-600",
                    location.pathname === item.href
                      ? "text-green-600"
                      : "text-slate-700"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link to="/carrito">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                    0
                  </span>
                </Button>
              </Link>
              <div className="hidden md:flex gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Ingresar</Button>
                </Link>
                <Link to="/registro">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-b bg-white">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block py-2 text-base font-medium",
                    location.pathname === item.href
                      ? "text-green-600"
                      : "text-slate-700"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                 <Link to="/login">
                  <Button variant="outline" className="w-full justify-center">Ingresar</Button>
                </Link>
                <Link to="/registro">
                  <Button className="w-full justify-center">Registrarse</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sprout className="h-6 w-6 text-green-500" />
                <span className="text-xl font-bold text-white">
                  Fresh<span className="text-green-500">Control</span>
                </span>
              </div>
              <p className="text-sm">
                Llevando la frescura del campo directamente a tu mesa con la mejor calidad y control.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-sm">
                {navigation.slice(0, 3).map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="hover:text-green-400">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacidad" className="hover:text-green-400">Privacidad</Link></li>
                <li><Link to="/terminos" className="hover:text-green-400">Términos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contacto</h3>
               <ul className="space-y-2 text-sm">
                <li>javierorellana2015.jaor@gmail.com</li>
                <li>+504 8789 0320</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs">
            © {new Date().getFullYear()} FreshControl. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
