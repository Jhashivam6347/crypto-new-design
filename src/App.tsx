import { useState, useEffect } from 'react';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import UserDashboard from './components/user/UserDashboard';
import DepositPage from './components/user/DepositPage';
import WithdrawPage from './components/user/WithdrawPage';
import TransactionsPage from './components/user/TransactionsPage';
import AdminDashboard from './components/admin/AdminDashboard';

function AppContent() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Simulate fetching user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedProfile = localStorage.getItem('profile');
    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser));
      setProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not logged in, show Login or Signup
  if (!user || !profile) {
    return authMode === 'login' ? (
      <LoginPage
        onSwitchToSignup={() => setAuthMode('signup')}
        onLoginSuccess={(loggedUser: any, loggedProfile: any) => {
          localStorage.setItem('user', JSON.stringify(loggedUser));
          localStorage.setItem('profile', JSON.stringify(loggedProfile));
          setUser(loggedUser);
          setProfile(loggedProfile);
        }}
      />
    ) : (
      <SignupPage
        onSwitchToLogin={() => setAuthMode('login')}
        onSignupSuccess={(newUser: any, newProfile: any) => {
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('profile', JSON.stringify(newProfile));
          setUser(newUser);
          setProfile(newProfile);
        }}
      />
    );
  }

  // Render dashboard based on role
  const renderPage = () => {
    if (profile.role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'users':
          return <div className="p-6 text-white">User Management - Coming Soon</div>;
        case 'kyc':
          return <div className="p-6 text-white">KYC Management - Coming Soon</div>;
        case 'transactions':
          return <TransactionsPage />;
        default:
          return <AdminDashboard />;
      }
    } else if (profile.role === 'merchant') {
      switch (currentPage) {
        case 'dashboard':
          return <UserDashboard />;
        case 'payments':
          return <div className="p-6 text-white">Merchant Payments - Coming Soon</div>;
        case 'transactions':
          return <TransactionsPage />;
        default:
          return <UserDashboard />;
      }
    } else {
      switch (currentPage) {
        case 'dashboard':
          return <UserDashboard />;
        case 'deposit':
          return <DepositPage />;
        case 'withdraw':
          return <WithdrawPage />;
        case 'transactions':
          return <TransactionsPage />;
        case 'profile':
          return <div className="p-6 text-white">Profile Settings - Coming Soon</div>;
        case 'support':
          return <div className="p-6 text-white">Support - Coming Soon</div>;
        default:
          return <UserDashboard />;
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    setUser(null);
    setProfile(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} role={profile.role} />
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
