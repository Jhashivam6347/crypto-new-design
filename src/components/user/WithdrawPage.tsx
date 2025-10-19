import { useState } from 'react';
import { DollarSign, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function WithdrawPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currency: 'USD',
    amount: '',
    accountType: 'bank',
    accountNumber: '',
    iban: '',
    upi: '',
    bankName: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const cryptoRate = 65000;
  const fee = 25;
  const cryptoAmount = formData.amount ? (Number(formData.amount) / cryptoRate).toFixed(6) : '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bankDetails = formData.accountType === 'bank'
        ? { accountNumber: formData.accountNumber, iban: formData.iban, bankName: formData.bankName }
        : { upi: formData.upi };

      await supabase
        .from('payout_requests')
        .insert([{
          user_id: user?.id,
          currency: formData.currency,
          amount: Number(formData.amount),
          bank_details: bankDetails,
          status: 'pending'
        }]);

      setShowModal(true);
      setFormData({
        currency: 'USD',
        amount: '',
        accountType: 'bank',
        accountNumber: '',
        iban: '',
        upi: '',
        bankName: ''
      });
    } catch (error) {
      console.error('Error submitting payout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
        <p className="text-gray-400">Convert your crypto to fiat currency</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Fiat Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="AED">AED - UAE Dirham</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Withdrawal Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Equivalent: {cryptoAmount} BTC
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Account Type</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: 'bank' })}
                  className={`flex-1 py-3 rounded-lg border-2 transition ${
                    formData.accountType === 'bank'
                      ? 'border-cyan-500 bg-cyan-500/10 text-white'
                      : 'border-slate-700 text-gray-400'
                  }`}
                >
                  Bank Account
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: 'upi' })}
                  className={`flex-1 py-3 rounded-lg border-2 transition ${
                    formData.accountType === 'upi'
                      ? 'border-cyan-500 bg-cyan-500/10 text-white'
                      : 'border-slate-700 text-gray-400'
                  }`}
                >
                  UPI
                </button>
              </div>
            </div>

            {formData.accountType === 'bank' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter bank name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">IBAN (Optional)</label>
                  <input
                    type="text"
                    value={formData.iban}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter IBAN"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">UPI ID</label>
                <input
                  type="text"
                  value={formData.upi}
                  onChange={(e) => setFormData({ ...formData, upi: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="username@upi"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Transaction Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Withdrawal Amount:</span>
                <span className="text-white font-semibold">${formData.amount || '0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Processing Fee:</span>
                <span className="text-white">${fee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Crypto Equivalent:</span>
                <span className="text-white">{cryptoAmount} BTC</span>
              </div>
              <div className="h-px bg-slate-700"></div>
              <div className="flex justify-between">
                <span className="text-white font-semibold">You Will Receive:</span>
                <span className="text-cyan-400 font-bold text-lg">
                  ${formData.amount ? (Number(formData.amount) - fee).toFixed(2) : '0'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-400 font-semibold text-sm mb-2">Important Information</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Processing time: 1-3 business days</li>
                  <li>• Minimum withdrawal: $100</li>
                  <li>• Maximum daily limit: $50,000</li>
                  <li>• KYC verification required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
              <p className="text-gray-400 mb-6">
                Your withdrawal request has been submitted successfully. We'll process it within 1-3 business days.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
