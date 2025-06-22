import { useState, useRef, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  const validate = () => {
    if (!username) return "Username is required";
    if (!password) return "Password is required";
    return "";
  };

  const login = async () => {
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover z-0"
        src="/video.mp4"
        poster="/fallback.jpg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
      <div className="relative z-30 flex flex-col items-center mb-8">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg text-center mb-2">Recipe Hub</h1>
        <p className="text-xl text-white font-semibold drop-shadow text-center mb-6">Discover, Save, and Cook Delicious Recipes!</p>
      </div>
      <div className="relative z-20 backdrop-blur-md bg-white/70 p-10 rounded-2xl shadow-2xl w-96 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-gray-800">Login</h1>
        {error && <div className="text-red-500 text-center text-sm mb-2">{error}</div>}
        <input
          className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition mb-2"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
        />
        <div className="relative mb-2">
          <input
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:text-blue-700 transition"
            onClick={() => setShowPassword(v => !v)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-3 rounded-lg w-full font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-2 text-center text-gray-700 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-600 underline hover:text-blue-800 transition">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
