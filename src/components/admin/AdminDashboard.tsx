import { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    dailyVolume: 0,
    pendingKYC: 0,
    pendingPayouts: 0,
  });

  useEffect(() => {
    // Simulate fetching from localStorage or mock data
    const mockStats = JSON.parse(localStorage.getItem('adminStats') || 'null');

    if (mockStats) {
      setStats(mockStats);
    } else {
      const newStats = {
        totalUsers: 1523,
        dailyVolume: 1250000,
        pendingKYC: 8,
        pendingPayouts: 3,
      };
      localStorage.setItem('adminStats', JSON.stringify(newStats));
      setStats(newStats);
    }
  }, []);

  const volumeData = [
    { name: 'Mon', volume: 450000 },
    { name: 'Tue', volume: 520000 },
    { name: 'Wed', volume: 480000 },
    { name: 'Thu', volume: 610000 },
    { name: 'Fri', volume: 580000 },
    { name: 'Sat', volume: 670000 },
    { name: 'Sun', volume: 720000 },
  ];

  const transactionData = [
    { name: 'Deposits', value: 450 },
    { name: 'Withdrawals', value: 280 },
    { name: 'Payments', value: 180 },
    { name: 'Conversions', value: 90 },
  ];

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-80 mb-1">Total Users</p>
          <h3 className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</h3>
          <p className="text-xs mt-2">+15% from last month</p>
        </div>

        {/* Daily Volume */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-80 mb-1">Daily Volume</p>
          <h3 className="text-3xl font-bold">${(stats.dailyVolume / 1000).toFixed(0)}K</h3>
          <p className="text-xs mt-2">+8.2% from yesterday</p>
        </div>

        {/* Pending KYC */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Action Required</span>
          </div>
          <p className="text-sm opacity-80 mb-1">Pending KYC</p>
          <h3 className="text-3xl font-bold">{stats.pendingKYC}</h3>
          <p className="text-xs mt-2">Requires review</p>
        </div>

        {/* Pending Payouts */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Pending</span>
          </div>
          <p className="text-sm opacity-80 mb-1">Payout Requests</p>
          <h3 className="text-3xl font-bold">{stats.pendingPayouts}</h3>
          <p className="text-xs mt-2">Awaiting approval</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Transaction Volume Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 5 }} name="Volume ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Transaction Breakdown</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            <button className="text-cyan-400 text-sm hover:text-cyan-300">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-slate-700">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {[
                  { id: 'TX001', user: 'john@example.com', type: 'Deposit', amount: '$5,000', status: 'completed' },
                  { id: 'TX002', user: 'alice@example.com', type: 'Withdrawal', amount: '$2,500', status: 'pending' },
                  { id: 'TX003', user: 'bob@example.com', type: 'Payment', amount: '$1,200', status: 'completed' },
                  { id: 'TX004', user: 'sarah@example.com', type: 'Deposit', amount: '$8,000', status: 'completed' },
                ].map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-750">
                    <td className="py-3 text-cyan-400">{tx.id}</td>
                    <td className="py-3">{tx.user}</td>
                    <td className="py-3">{tx.type}</td>
                    <td className="py-3 font-semibold">{tx.amount}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-sm">Just now</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">System Alerts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold text-sm">High Value Transaction</p>
                  <p className="text-gray-300 text-xs mt-1">$50,000 withdrawal pending approval</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-semibold text-sm">KYC Pending</p>
                  <p className="text-gray-300 text-xs mt-1">12 users awaiting verification</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <Activity className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-semibold text-sm">System Status</p>
                  <p className="text-gray-300 text-xs mt-1">All services operational</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
