import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function RecipeSearchPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRandomRecipes();
  }, []);
  
  const fetchRandomRecipes = async (append = false) => {
    setLoading(true);
    try {
      const res = await axios.get('/recipes/by-random');
      if (append) {
        setRecipes(prev => [...prev, ...res.data]);
      } else {
        setRecipes(res.data);
      }
    } catch (err) {
      setError('Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchRecipes = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/recipes/search?query=${encodeURIComponent(query)}`);
      setRecipes(res.data);
    } catch (err) {
      setError('Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setActiveQuery(search);
      fetchSearchRecipes(search);
    } else {
      setActiveQuery('');
      fetchRandomRecipes();
    }
  };

  const handleClear = () => {
    setSearch('');
    setActiveQuery('');
    fetchRandomRecipes();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-800 text-center">Discover New Recipes</h1>
      <form onSubmit={handleSearch} className="flex justify-center mb-8 gap-2">
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          placeholder="Search for recipes (e.g. pasta, chicken, tiramisu...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-green-700 transition"
        >
          Search
        </button>
        {activeQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold shadow"
          >
            Clear
          </button>
        )}
      </form>
      {/* Refresh Button */}
      {!activeQuery && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => fetchRandomRecipes(false)}
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            Refresh Recommendations
          </button>
        </div>
      )}
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition border border-gray-100"
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="rounded-lg mb-4 w-48 h-48 object-cover shadow"
            />
            <h2 className="font-bold text-lg text-center mb-2 text-gray-800 line-clamp-2">{recipe.title}</h2>
            <button
              className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow hover:from-green-500 hover:to-green-700 transition"
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              View Detail
            </button>
          </div>
        ))}
      </div>
      {/* Load More Button */}
      {!activeQuery && recipes.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchRandomRecipes(true)}
            className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition disabled:opacity-50"
            disabled={loading}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
