import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaUtensils, FaSyncAlt, FaPlus, FaSearch, FaHeart } from 'react-icons/fa';

// --- New: Tips and slider image ---
const SLIDER_IMAGE = 'https://coffee.alexflipnote.dev/-rhb4zf9aOI_coffee.jpg';

const INITIAL_RECIPE_COUNT = 4;
const RECIPE_INCREMENT = 4;

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_RECIPE_COUNT);

  useEffect(() => {
    axios.get('/inventory').then(res => setInventory(res.data));
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const res = await axios.get('/recipes/by-ingredients');
      const shuffled = shuffleArray(res.data);
      setRecipes(shuffled);
      setVisibleCount(INITIAL_RECIPE_COUNT);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(count => Math.min(count + RECIPE_INCREMENT, recipes.length));
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden mt-4 shadow-lg rounded-3xl mb-4">
        <img
          src={SLIDER_IMAGE}
          alt="Cooking inspiration"
          className="w-full h-full object-cover object-center rounded-3xl"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow mb-2 text-center">Welcome to Your Kitchen Dashboard</h1>
          <p className="text-lg md:text-2xl text-white/90 font-medium text-center">Get inspired, manage your pantry, and discover new recipes!</p>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-0 md:px-0 lg:px-0 pb-4">
        {/* Inventory Summary */}
        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col min-h-[24rem]">
          <div className="flex items-center mb-4">
            <FaBoxOpen className="text-blue-500 text-2xl mr-2" />
            <h2 className="text-xl font-bold text-gray-700">Inventory Summary</h2>
          </div>
          {(() => {
            // Sort by expiry date (soonest first)
            const soonestExpiry = [...inventory]
              .filter(item => item.expiryDate)
              .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
              .slice(0, 5);

            // Sort by createdAt (most recent first)
            const mostRecent = [...inventory]
              .filter(item => item.createdAt)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5);

            return (
              <>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Expiring Soon</h3>
                  <ul className="divide-y divide-gray-200 flex-1 overflow-y-auto pb-10">
                    {soonestExpiry.length === 0 ? (
                      <li className="py-2 text-gray-500 text-center">No expiring items.</li>
                    ) : (
                      soonestExpiry.map(item => (
                        <li key={item._id} className="flex items-center py-2 px-2 hover:bg-blue-50 rounded-lg transition">
                          <span className="flex-1 text-gray-800 font-medium">{item.name}</span>
                          <span className="ml-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{item.quantity}</span>
                          <span className="ml-4 text-gray-500 text-xs">
                            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'No expiry'}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">Recently Added</h3>
                  <ul className="divide-y divide-gray-200">
                    {mostRecent.length === 0 ? (
                      <li className="py-2 text-gray-500 text-center">No recent items.</li>
                    ) : (
                      mostRecent.map(item => (
                        <li key={item._id} className="flex items-center py-2 px-2 hover:bg-green-50 rounded-lg transition">
                          <span className="flex-1 text-gray-800 font-medium">{item.name}</span>
                          <span className="ml-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">{item.quantity}</span>
                          <span className="ml-4 text-gray-500 text-xs">
                            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'No expiry'}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </>
            );
          })()}
          <Link
            to="/inventory"
            className="absolute bottom-0 left-0 w-full pb-8 text-blue-600 hover:underline font-semibold text-center"
          >
            View Full Inventory
          </Link>
        </div>
        {/* Recipe Recommendations */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col ">
          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              <FaUtensils className="text-green-500 text-2xl mr-2" />
              <h2 className="text-xl font-bold text-gray-700 mb-0">Recipe Recommendations Based On Your Exist Ingredients</h2>
            </div>
            <button
              onClick={fetchRecipes}
              className="ml-2 p-2 rounded-full bg-green-100 hover:bg-green-200 transition text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              title="Refresh Recommendations"
              disabled={loadingRecipes}
            >
              <FaSyncAlt className={loadingRecipes ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 flex-1"
               style={{ maxHeight: '31rem' }}>
            {loadingRecipes ? (
              <div className="col-span-full text-gray-500 text-center">Loading...</div>
            ) : recipes.length === 0 ? (
              <div className="col-span-full text-gray-500 text-center">No recommendations yet.</div>
            ) : (
              recipes.slice(0, visibleCount).map(recipe => (
                <div key={recipe.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-xl transition">
                  <img src={recipe.image} alt={recipe.title} className="rounded-lg mb-2 w-24 h-24 object-cover shadow" />
                  <h3 className="font-semibold text-md text-center mb-2 text-gray-800 line-clamp-2">{recipe.title}</h3>
                  <Link to={`/recipes/${recipe.id}`} className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-lg font-semibold shadow hover:from-green-500 hover:to-green-700 transition mt-auto text-sm">View</Link>
                </div>
              ))
            )}
          </div>
          {/* Load More Button */}
          {!loadingRecipes && visibleCount < recipes.length && recipes.length > 0 && (
            <button
              onClick={handleLoadMore}
              className="mt-4 mx-auto px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
