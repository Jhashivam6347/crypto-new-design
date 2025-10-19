import {
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  History,
  Settings,
  HelpCircle,
  Users,
  Shield,
  DollarSign,
  Activity,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  role?: 'user' | 'merchant' | 'admin'; // made optional for safety
}

export default function Sidebar({ currentPage, onPageChange, role = 'user' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'deposit', icon: ArrowDownToLine, label: 'Deposit' },
    { id: 'withdraw', icon: ArrowUpFromLine, label: 'Withdraw' },
    { id: 'transactions', icon: History, label: 'Transactions' },
    { id: 'profile', icon: Settings, label: 'Settings' },
    { id: 'support', icon: HelpCircle, label: 'Support' },
  ];

  const merchantMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'transactions', icon: History, label: 'Transactions' },
    { id: 'analytics', icon: Activity, label: 'Analytics' },
    { id: 'profile', icon: Settings, label: 'Settings' },
    { id: 'support', icon: HelpCircle, label: 'Support' },
  ];

  const adminMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'kyc', icon: Shield, label: 'KYC/AML' },
    { id: 'merchants', icon: CreditCard, label: 'Merchants' },
    { id: 'transactions', icon: History, label: 'Transactions' },
    { id: 'payouts', icon: DollarSign, label: 'Payouts' },
    { id: 'wallet', icon: Wallet, label: 'Wallets' },
    { id: 'config', icon: Settings, label: 'Config' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'audit', icon: Activity, label: 'Audit Logs' },
    { id: 'tickets', icon: HelpCircle, label: 'Tickets' },
  ];

  const menuItems =
    role === 'admin'
      ? adminMenuItems
      : role === 'merchant'
      ? merchantMenuItems
      : userMenuItems;

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold">CryptoX</h2>
              <p className="text-xs text-cyan-400 capitalize">{role} Portal</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition text-gray-400 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center ${
                collapsed ? 'justify-center' : 'space-x-3'
              } px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
