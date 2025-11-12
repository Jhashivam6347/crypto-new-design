import { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  Gift,
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function UserDashboard() {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cashback, setCashback] = useState({ balance: 0, total_earned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from localStorage
    const storedHoldings = localStorage.getItem('holdings');
    const storedTransactions = localStorage.getItem('transactions');
    const storedCashback = localStorage.getItem('cashback');

    setHoldings(storedHoldings ? JSON.parse(storedHoldings) : []);
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
    setCashback(storedCashback ? JSON.parse(storedCashback) : { balance: 25, total_earned: 120 });
    setLoading(false);
  }, []);

  const totalValue = holdings.reduce((sum, h) => sum + Number(h.usd_value), 0);

  const portfolioData = holdings.map((h) => ({
    name: h.currency,
    value: Number(h.usd_value),
  }));

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  const chartData = [
    { name: 'Mon', value: 45000 },
    { name: 'Tue', value: 52000 },
    { name: 'Wed', value: 48000 },
    { name: 'Thu', value: 61000 },
    { name: 'Fri', value: 58000 },
    { name: 'Sat', value: 67000 },
    { name: 'Sun', value: totalValue || 65000 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 ">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-sm opacity-80 mb-1">Portfolio Value</p>
          <h3 className="text-3xl font-bold">${totalValue.toLocaleString()}</h3>
          <p className="text-xs mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5% this week
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-sm text-gray-400 mb-1">Today's Profit</p>
          <h3 className="text-2xl font-bold text-white">+$2,450</h3>
          <p className="text-xs text-green-400 mt-2">+5.2%</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-sm text-gray-400 mb-1">Cashback Balance</p>
          <h3 className="text-2xl font-bold text-white">${cashback.balance}</h3>
          <p className="text-xs text-gray-400 mt-2">Total earned: ${cashback.total_earned}</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-sm text-gray-400 mb-1">Transactions</p>
          <h3 className="text-2xl font-bold text-white">{transactions.length}</h3>
          <p className="text-xs text-gray-400 mt-2">Last 30 days</p>
        </div>
      </div>

      {/* Portfolio & Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Portfolio Distribution</h3>
          <div className="h-64">
            {portfolioData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No holdings yet</div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Portfolio Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            <button className="text-cyan-400 text-sm hover:text-cyan-300">View All</button>
          </div>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}
                    >
                      {tx.type === 'deposit' ? (
                        <ArrowDownToLine className="w-5 h-5 text-green-400" />
                      ) : (
                        <ArrowUpFromLine className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{tx.type}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {tx.type === 'deposit' ? '+' : '-'}
                      {tx.amount} {tx.currency}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        tx.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : tx.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">No transactions yet</div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-4 bg-green-600 rounded-lg hover:bg-green-700 transition">
              <ArrowDownToLine className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Deposit Crypto</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
              <ArrowUpFromLine className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Withdraw Funds</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
              <CreditCard className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Make Payment</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-white">Cashback Rewards</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              You have ${cashback.balance} available to redeem
            </p>
            <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition">
              Redeem Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
