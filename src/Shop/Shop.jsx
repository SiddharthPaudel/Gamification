import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Shop = () => {
  const { user, setUser, updateUserProfile } = useAuth(); // <-- Added updateUserProfile
  const [heartsToBuy, setHeartsToBuy] = useState(1);
  const XP_COST_PER_HEART = 100;

  if (!user) return null;

  const handleBuy = async () => {
    const totalCost = heartsToBuy * XP_COST_PER_HEART;

    if (user.xp < totalCost) {
      toast.error("You don't have enough XP to buy this many hearts.");
      return;
    }

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
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded shadow-md space-y-4">
      <h2 className="text-xl font-bold text-indigo-600">GamifyZone Shop</h2>

      <p className="text-gray-700">1 ❤️ costs <span className="font-semibold">{XP_COST_PER_HEART} XP</span></p>

      <div className="flex items-center space-x-2">
        <label htmlFor="hearts" className="font-medium">Hearts to Buy:</label>
        <input
          id="hearts"
          type="number"
          min="1"
          max="10"
          value={heartsToBuy}
          onChange={(e) => setHeartsToBuy(Number(e.target.value))}
          className="border px-2 py-1 rounded w-16"
        />
      </div>

      <p>Total Cost: <span className="font-semibold">{heartsToBuy * XP_COST_PER_HEART} XP</span></p>

      <button
        onClick={handleBuy}
        disabled={user.xp < heartsToBuy * XP_COST_PER_HEART}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded"
      >
        Buy ❤️
      </button>

      <div className="pt-4 border-t text-sm text-gray-600">
        <p>Your XP: <span className="font-bold">{user.xp}</span></p>
        <p>Your Hearts: <span className="font-bold">{user.hearts || 0}</span></p>
      </div>
    </div>
  );
};

export default Shop;
