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
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  role?: "user" | "merchant" | "admin";
}

export default function Sidebar({
  currentPage,
  onPageChange,
  role = "user",
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userMenuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "deposit", icon: ArrowDownToLine, label: "Deposit" },
    { id: "withdraw", icon: ArrowUpFromLine, label: "Withdraw" },
    { id: "transactions", icon: History, label: "Transactions" },
    { id: "profile", icon: Settings, label: "Settings" },
    { id: "support", icon: HelpCircle, label: "Support" },
  ];

  const merchantMenuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "payments", icon: CreditCard, label: "Payments" },
    { id: "transactions", icon: History, label: "Transactions" },
    { id: "analytics", icon: Activity, label: "Analytics" },
    { id: "profile", icon: Settings, label: "Settings" },
    { id: "support", icon: HelpCircle, label: "Support" },
  ];

  const adminMenuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "users", icon: Users, label: "Users" },
    { id: "kyc", icon: Shield, label: "KYC/AML" },
    { id: "merchants", icon: CreditCard, label: "Merchants" },
    { id: "transactions", icon: History, label: "Transactions" },
    { id: "payouts", icon: DollarSign, label: "Payouts" },
    { id: "wallet", icon: Wallet, label: "Wallets" },
    { id: "config", icon: Settings, label: "Config" },
    { id: "reports", icon: FileText, label: "Reports" },
    { id: "audit", icon: Activity, label: "Audit Logs" },
    { id: "tickets", icon: HelpCircle, label: "Tickets" },
  ];

  const menuItems =
    role === "admin"
      ? adminMenuItems
      : role === "merchant"
      ? merchantMenuItems
      : userMenuItems;

  return (
    <>
      {/* ✅ Mobile top bar with hamburger */}
      <div className="md:hidden h-16 z-50 flex items-start justify-between bg-slate-900 px-4 py-3 border-b border-slate-800 fixed top-0 left-0 ">
        {/* <div className="flex items-center space-x-2"> */}
          {/* <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center"> */}
            {/* <TrendingUp className="w-5 h-5 text-white" /> */}
          {/* </div> */}
          {/* <h2 className="text-white font-semibold">CryptoX</h2> */}
        {/* </div> */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ✅ Sidebar */}
      <div
        className={`
          ${collapsed ? "w-20" : "w-64"}
          bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col
          fixed md:static  top-0 left-0 z-40
          ${mobileOpen ? "translate-x-0 h-full" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 h-16 items-center justify-between border-b border-slate-800 flex">
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
          {/* Desktop collapse button only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden  md:block p-2 hover:bg-slate-800 rounded-lg transition text-gray-400 hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden h-16 p-2 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 px-2 sm:px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center ${
                  collapsed ? "justify-center" : "space-x-3"
                } px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-slate-800 hover:text-white"
                }`}
                title={collapsed ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`font-medium ${
                    collapsed ? "hidden" : "hidden md:inline"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ✅ Mobile overlay when sidebar is open */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  );
}
