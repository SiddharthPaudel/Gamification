import User from '../models/User.js';

const XP_COST_PER_HEART = 100;

export const buyHearts = async (req, res) => {
  const { userId, heartsToBuy } = req.body;

  if (!userId || !heartsToBuy || heartsToBuy <= 0) {
    return res.status(400).json({ msg: "Invalid request data" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const totalCost = heartsToBuy * XP_COST_PER_HEART;

    if (user.xp < totalCost) {
      return res.status(400).json({ msg: "Not enough XP to buy hearts" });
    }

    user.xp -= totalCost;
    user.hearts = (user.hearts || 0) + heartsToBuy;

    await user.save();

    return res.json({
      msg: `Purchased ${heartsToBuy} hearts successfully.`,
      hearts: user.hearts,
      xp: user.xp,
    });
  } catch (err) {
    console.error("Error in buyHearts controller:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};