
import { Link, useLocation } from "react-router-dom";
import { Shirt, Home, Combine, Image, Bot, Calendar } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const navItems = [
  { title: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
  { title: "Closet", path: "/closet", icon: <Shirt className="w-4 h-4" /> },
  { title: "Suggestions", path: "/suggestions", icon: <Combine className="w-4 h-4" /> },
  { title: "Today", path: "/today-outfit", icon: <Calendar className="w-4 h-4" /> },
  { title: "AI Chat", path: "/ai-chat", icon: <Bot className="w-4 h-4" /> },
];

const Layout = ({ children, hideNav = false }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-ios-background text-ios-text">
      {!hideNav && (
        <header className="ios-top-bar">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-black">Closet Fusion</span>
          </Link>
        </header>
      )}
      
      <main className="flex-1 mt-10 mb-12 px-1 py-2">
        {children}
      </main>
      
      {!hideNav && (
        <div className="ios-nav">
          <nav className="container h-full mx-auto px-2 sm:px-4">
            <ul className="flex items-center justify-around h-full">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`ios-tab ${isActive ? 'active' : ''}`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-[10px]">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Layout;
