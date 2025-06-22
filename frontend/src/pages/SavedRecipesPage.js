import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/recipes/saved');
      setRecipes(res.data);
    } catch (err) {
      setError('Failed to fetch saved recipes.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemove = async (recipeId) => {
    try {
      await axios.post('/recipes/remove', { recipeId });
      setRecipes(recipes => recipes.filter(r => r.id !== recipeId));
    } catch (err) {
      alert('Failed to remove recipe.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-800 text-center">Your Saved Recipes</h1>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {recipes.length === 0 && !loading && !error && (
          <div className="col-span-full text-gray-500 text-center">No saved recipes yet.</div>
        )}
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
            <div className="flex gap-2 mt-4">
              <button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow hover:from-green-500 hover:to-green-700 transition"
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                View Detail
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:from-red-600 hover:to-red-800 transition"
                onClick={() => handleRemove(recipe.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
