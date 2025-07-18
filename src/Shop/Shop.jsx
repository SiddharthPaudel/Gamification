import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Shop = () => {
  const { user, setUser, updateUserProfile } = useAuth();
  const [heartsToBuy, setHeartsToBuy] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const XP_COST_PER_HEART = 100;

  if (!user) return null;

  const handleBuy = async () => {
    const totalCost = heartsToBuy * XP_COST_PER_HEART;

    if (user.xp < totalCost) {
      toast.error("You don't have enough XP to buy this many hearts.");
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/user/buy-hearts', {
        userId: user.id,
        heartsToBuy,
      });

      updateUserProfile({
        ...user,
        hearts: res.data.hearts,
        xp: res.data.xp,
      });

      toast.success(`Successfully bought ${heartsToBuy} hearts!`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to buy hearts.');
    } finally {
      setIsLoading(false);
    }
  };

  const canAfford = user.xp >= heartsToBuy * XP_COST_PER_HEART;
  const totalCost = heartsToBuy * XP_COST_PER_HEART;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Heart Shop</h1>
          <p className="text-gray-600">Exchange XP for hearts</p>
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stats Section */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h2>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm text-amber-700 font-medium">XP</p>
                    <p className="text-xl font-bold text-amber-800">{user.xp}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-lg">❤️</span>
                  </div>
                  <div>
                    <p className="text-sm text-red-700 font-medium">Hearts</p>
                    <p className="text-xl font-bold text-red-800">{user.hearts || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">❤️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Life Hearts</h3>
                  <p className="text-gray-600">100 XP each</p>
                </div>
              </div>

              {/* Controls Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* Quantity Controls */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setHeartsToBuy(Math.max(1, heartsToBuy - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      <span className="font-bold">-</span>
                    </button>
                    <div className="w-16 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="font-bold">{heartsToBuy}</span>
                    </div>
                    <button
                      onClick={() => setHeartsToBuy(Math.min(10, heartsToBuy + 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      <span className="font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* Quick Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quick select</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 3, 5, 10].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setHeartsToBuy(amount)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium ${
                          heartsToBuy === amount
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purchase Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Total Cost:</span>
                  <span className="text-xl font-bold text-blue-600">{totalCost} XP</span>
                </div>
                <div className="text-sm text-gray-600">
                  {heartsToBuy} heart{heartsToBuy > 1 ? 's' : ''} × 100 XP each
                </div>
              </div>

              {/* Insufficient XP Warning */}
              {!canAfford && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-red-600 text-sm font-medium">
                    Need {totalCost - user.xp} more XP
                  </p>
                </div>
              )}

              {/* Buy Button */}
              <button
                onClick={handleBuy}
                disabled={!canAfford || isLoading}
                className={`w-full py-3 px-6 rounded-xl font-bold ${
                  canAfford && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Buy ${heartsToBuy} Heart${heartsToBuy > 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;