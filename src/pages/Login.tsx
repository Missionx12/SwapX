import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle login or signup if user doesn't exist
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    // Try to sign in
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      // If user not found, try to sign up
      if (loginError.message.toLowerCase().includes('invalid login credentials')) {
        const { error: signupError } = await supabase.auth.signUp({ email, password });
        if (signupError) {
          setError(signupError.message);
          setLoading(false);
          return;
        }
        // After signup, try login again
        const { error: loginAfterSignupError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginAfterSignupError) {
          setError(loginAfterSignupError.message);
          setLoading(false);
          return;
        }
      } else {
        setError(loginError.message);
        setLoading(false);
        return;
      }
    }
    // Get current session and redirect
    const session = (await supabase.auth.getSession()).data.session;
    if (session?.user) {
      navigate('/feed');
    } else {
      setError('Login failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-500 cursor-pointer underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
