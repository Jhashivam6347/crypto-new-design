import { useState, useEffect } from 'react';
import { Copy, Check, Bitcoin, Wallet, QrCode } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function DepositPage() {
  const { user } = useAuth();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const cryptos = [
    { code: 'BTC', name: 'Bitcoin', color: 'from-orange-400 to-orange-600' },
    { code: 'ETH', name: 'Ethereum', color: 'from-blue-400 to-blue-600' },
    { code: 'USDT', name: 'Tether', color: 'from-green-400 to-green-600' },
    { code: 'BNB', name: 'Binance Coin', color: 'from-yellow-400 to-yellow-600' },
  ];

  useEffect(() => {
    loadWalletAddress();
  }, [selectedCrypto, user]);

  const loadWalletAddress = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('wallet_addresses')
      .select('address')
      .eq('user_id', user.id)
      .eq('currency', selectedCrypto)
      .maybeSingle();

    if (data) {
      setWalletAddress(data.address);
    } else {
      const newAddress = `${selectedCrypto}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      await supabase
        .from('wallet_addresses')
        .insert([{ user_id: user.id, currency: selectedCrypto, address: newAddress }]);
      setWalletAddress(newAddress);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Deposit Crypto</h1>
        <p className="text-gray-400">Select a cryptocurrency and get your unique deposit address</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {cryptos.map((crypto) => (
          <button
            key={crypto.code}
            onClick={() => setSelectedCrypto(crypto.code)}
            className={`p-4 rounded-xl border-2 transition ${
              selectedCrypto === crypto.code
                ? 'border-cyan-500 bg-slate-800'
                : 'border-slate-700 bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${crypto.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Bitcoin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold">{crypto.code}</h3>
            <p className="text-xs text-gray-400">{crypto.name}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedCrypto} Deposit</h2>
              <p className="text-sm text-gray-400">Network: {selectedCrypto === 'USDT' ? 'TRC20' : 'Mainnet'}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-cyan-300 mb-2">Your Deposit Address</label>
            <div className="relative">
              <input
                type="text"
                value={walletAddress}
                readOnly
                className="w-full px-4 py-3 pr-12 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-700 rounded-lg transition"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {copied && <p className="text-green-400 text-sm mt-2">Address copied!</p>}
          </div>

          <div className="bg-slate-900 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-cyan-400" />
              QR Code
            </h3>
            <div className="bg-white p-4 rounded-lg inline-block">
              <div className="w-48 h-48 bg-slate-200 flex items-center justify-center text-xs text-gray-500">
                QR Code for {walletAddress.substring(0, 10)}...
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-semibold mb-2">Important Notes:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Minimum deposit: 0.0001 {selectedCrypto}</li>
              <li>• Required confirmations: {selectedCrypto === 'BTC' ? '3' : '12'}</li>
              <li>• Only send {selectedCrypto} to this address</li>
              <li>• Funds will appear after confirmation</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Recent Deposits</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">0.5 BTC</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Confirmed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">2.5 ETH</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Confirmed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">1000 USDT</p>
                  <p className="text-xs text-gray-400">3 days ago</p>
                </div>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Pending</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Transaction Status</h3>
            <p className="text-gray-300 text-sm mb-4">Track your deposit in real-time with our advanced monitoring system</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Average confirmation time: 10-30 min</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Instant notifications enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
