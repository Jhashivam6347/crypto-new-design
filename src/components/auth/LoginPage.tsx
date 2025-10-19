import { useState } from 'react';
import { Lock, Mail, TrendingUp } from 'lucide-react';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: (loggedUser: any, loggedProfile: any) => void;
}

export default function LoginPage({ onSwitchToSignup, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get all users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = storedUsers.find(
        (user: any) => user.email === email && user.password === password
      );

      if (!existingUser) {
        throw new Error('Invalid email or password');
      }

      // Call the callback to update parent state
      onLoginSuccess(existingUser, { role: existingUser.role });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-cyan-500/50">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">CryptoX Portal</h1>
          <p className="text-cyan-300">Secure. Fast. Reliable.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition shadow-lg shadow-cyan-500/50 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <div className="text-center">
              <span className="text-gray-300">Don't have an account? </span>
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
