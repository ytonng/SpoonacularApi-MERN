import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        setError('Failed to fetch recipe details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const res = await axios.get('/recipes/saved');
        setSavedRecipeIds(res.data.map(r => r.id));
      } catch (err) {
        // ignore error
      }
    };
    fetchSavedRecipes();
  }, []);

  useEffect(() => {
    if (savedRecipeIds.includes(Number(id))) {
      setSaveStatus('saved');
    } else {
      setSaveStatus('idle');
    }
  }, [savedRecipeIds, id]);

  const handleSaveRecipe = async () => {
    setSaveStatus('saving');
    try {
      await axios.post('/recipes/save', { recipeId: Number(id) });
      setSaveStatus('saved');
      setSavedRecipeIds(prev => [...prev, Number(id)]);
    } catch (err) {
      setSaveStatus('error');
    }
  };

  if (loading) return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!recipe) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-9xl mx-auto bg-white rounded-2xl shadow-lg p-0 md:p-8 flex flex-col gap-8">
        {/* Top Bar: Back Button (left) and Save Button (right) */}
        <div className="w-full flex justify-between items-center mb-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold shadow w-32"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold shadow transition w-48 whitespace-nowrap flex items-center justify-center gap-2
              ${saveStatus === 'saved' ? 'bg-green-400 text-white cursor-not-allowed' :
                saveStatus === 'saving' ? 'bg-gray-300 text-gray-500 cursor-wait' :
                'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700'}
            `}
            onClick={handleSaveRecipe}
            disabled={saveStatus === 'saved' || saveStatus === 'saving'}
          >
            {saveStatus === 'saved' ? <><span>Saved</span><span>✔️</span></> : saveStatus === 'saving' ? <span>Saving...</span> : <span>Save to Favorites</span>}
          </button>
        </div>
        {saveStatus === 'error' && (
          <div className="text-red-500 text-sm mb-2 text-right">Failed to save. Please try again.</div>
        )}
        {/* Top: Image & Description */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Image */}
          <div className="md:w-1/2 w-full flex justify-center items-center bg-gray-100 rounded-lg p-4">
            <img src={recipe.image} alt={recipe.title} className="rounded-lg w-full h-72 object-cover shadow" />
          </div>
          {/* Description */}
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            <h1 className="text-3xl font-extrabold mb-2 text-gray-800">{recipe.title}</h1>
            <div className="text-gray-600 mb-2 prose max-w-none" dangerouslySetInnerHTML={{ __html: recipe.summary }} />
          </div>
        </div>
        {/* Bottom: Ingredients & Method */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Ingredients */}
          <div className="md:w-1/2 w-full">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Ingredients</h2>
            <ul className="list-disc list-inside text-gray-700">
              {recipe.extendedIngredients?.map(ing => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>
          </div>
          {/* Method */}
          <div className="md:w-1/2 w-full">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Method</h2>
            <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: recipe.instructions || 'No instructions available.' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
