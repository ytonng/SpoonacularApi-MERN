import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import RecipeSearchPage from './pages/RecipeSearchPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SavedRecipesPage from './pages/SavedRecipesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex min-h-screen">
      {!isAuthPage && <Sidebar />}
      <main className={`flex-1 bg-gray-50 pt-0 pr-4 pl-4 pb-0 ${!isAuthPage ? 'md:ml-64' : ''}`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/search" element={<RecipeSearchPage />} />
          <Route path="/saved" element={<SavedRecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
