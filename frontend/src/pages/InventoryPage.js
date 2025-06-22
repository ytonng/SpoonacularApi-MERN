import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { FaTrash } from 'react-icons/fa';

const QUANTITY_TYPES = ['piece', 'kg', 'g', 'box', 'pack', 'liter', 'ml', 'dozen', 'other'];

function getExpiryColor(dateStr) {
  if (!dateStr) return '';
  const today = new Date();
  const expiry = new Date(dateStr);
  const diff = (expiry - today) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'text-red-600 font-bold'; // expired
  if (diff < 3) return 'text-orange-500 font-semibold'; // close to expiry
  return 'text-gray-700';
}

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quantityType, setQuantityType] = useState('piece');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/inventory').then(res => setItems(res.data));
  }, []);

  const add = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await axios.post('/inventory', {
      name,
      quantity,
      quantityType,
      expiryDate: expiryDate || undefined,
    });
    setItems([...items, res.data]);
    setName('');
    setQuantity(1);
    setQuantityType('piece');
    setExpiryDate('');
    setLoading(false);
  };

  const remove = async (id) => {
    setLoading(true);
    await axios.delete(`/inventory/${id}`);
    setItems(items.filter(i => i._id !== id));
    setLoading(false);
  };

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-800 text-center">Inventory</h1>
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8">
        <form className="flex flex-col md:flex-row md:items-end gap-4 flex-wrap" onSubmit={e => { e.preventDefault(); add(); }}>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Item name"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Quantity</label>
            <input
              className="border border-gray-300 p-3 rounded-lg w-24 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Type</label>
            <select
              className="border border-gray-300 p-3 rounded-lg w-28 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={quantityType}
              onChange={e => setQuantityType(e.target.value)}
              disabled={loading}
            >
              {QUANTITY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Expiry Date</label>
            <input
              className="border border-gray-300 p-3 rounded-lg w-44 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              type="date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2 md:mt-0"
            type="submit"
            disabled={loading || !name.trim()}
          >
            Add
          </button>
        </form>
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 overflow-x-auto max-h-[65vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Expiry Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Added Time</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-gray-500 text-center">No items in inventory. Add your first item!</td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item._id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.quantityType || 'piece'}</td>
                  <td className={`px-4 py-3 ${getExpiryColor(item.expiryDate)}`}>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <span className="font-semibold"></span> {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition"
                      onClick={() => remove(item._id)}
                      disabled={loading}
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
