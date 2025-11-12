import { Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  onLogout?: () => void; // 👈 add this line
}

export default function Navbar({ onLogout }: NavbarProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { profile, signOut } = useAuth();

  const username = profile?.username || "Guest";
  const role = profile?.role || "user";

  const notifications = [
    { id: 1, text: 'New deposit confirmed: 0.5 BTC', time: '5m ago', unread: true },
    { id: 2, text: 'Withdrawal completed successfully', time: '1h ago', unread: true },
    { id: 3, text: 'Your KYC has been approved', time: '2h ago', unread: false },
  ];

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout(); // uses parent logout (App.tsx)
    } else {
      signOut(); // fallback to AuthContext logout
    }
  };

  return (
    <div className="h-16 fixed top-0 ps-10 md:ps-6 w-full z-40 md:[position:unset] bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <div className=" items-center space-x-4 hidden md:flex">
        <h1 className="text-xl font-semibold text-white ">Welcome back, {username}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-slate-800 rounded-lg transition text-gray-400 hover:text-white"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-slate-800 rounded-lg transition text-gray-400 hover:text-white relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-slate-700 hover:bg-slate-700 transition ${
                      notif.unread ? 'bg-slate-750' : ''
                    }`}
                  >
                    <p className="text-white text-sm">{notif.text}</p>
                    <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center">
                <button className="text-cyan-400 text-sm hover:text-cyan-300">View all</button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium hidden md:inline-block">{username}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
              <div className="p-3 border-b border-slate-700">
                <p className="text-white font-medium">{username}</p>
                <p className="text-gray-400 text-xs capitalize">{role}</p>
              </div>
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center space-x-2 p-3 hover:bg-slate-700 transition text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
