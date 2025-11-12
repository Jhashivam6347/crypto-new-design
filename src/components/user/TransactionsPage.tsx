import { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowUpDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setTransactions(data);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
        <p className="text-gray-400">View and manage all your transactions</p>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID or currency..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="payment">Payment</option>
            <option value="conversion">Conversion</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center space-x-2 transition">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full whitespace-nowrap table-fixed">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-slate-700">
                <th className="pb-3 pr-4 min-w-10 whitespace-nowrap inline-block">
                  <button className="flex items-center space-x-1 hover:text-white">
                    <span>Transaction ID</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="pb-3 pr-4 min-w-10 whitespace-nowrap inline-block">Type</th>
                <th className="pb-3 pr-4 min-w-10 whitespace-nowrap inline-block">Currency</th>
                <th className="pb-3 pr-4 min-w-10 whitespace-nowrap inline-block">Amount</th>
                <th className="pb-3 pr-4 min-w-10 whitespace-nowrap inline-block">Status</th>
                <th className="pb-3 min-w-5">Date</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-750 cursor-pointer transition">
                  <td className="py-4 pr-4">
                    <span className="text-cyan-400 font-mono text-sm">{tx.id.substring(0, 8)}...</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="capitalize">{tx.type}</span>
                  </td>
                  <td className="py-4 pr-4 font-semibold">{tx.currency}</td>
                  <td className="py-4 pr-4">
                    <span className={tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}>
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-400 text-sm">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
