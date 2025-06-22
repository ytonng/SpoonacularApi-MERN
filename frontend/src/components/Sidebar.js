import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/search', label: 'Search Recipes' },
  { to: '/saved', label: 'Saved Recipes' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-full z-30 bg-gradient-to-b from-blue-700 to-blue-900 text-white w-64 p-6 hidden md:flex flex-col justify-between">
      <div>
        <div className="mb-8 text-2xl font-bold tracking-wide">🍳 My Kitchen</div>
        <ul>
          {navItems.map(item => (
            <li key={item.to} className="mb-2">
              <Link
                to={item.to}
                className={`block py-2 px-4 rounded transition ${
                  location.pathname === item.to
                    ? 'bg-blue-600 font-semibold'
                    : 'hover:bg-blue-800'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="block w-full py-2 px-4 rounded transition bg-blue-500 hover:bg-blue-600 font-semibold"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}