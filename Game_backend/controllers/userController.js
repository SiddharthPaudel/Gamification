// controllers/userController.js
import User from '../models/User.js';

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Only allow updating name and email
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      msg: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Update error:', err.message);
    res.status(500).json({ msg: 'Failed to update user' });
  }
};
