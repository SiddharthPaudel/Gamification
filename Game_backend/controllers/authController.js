// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Correct way to import the User model
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

// Signup Controller
export const signupController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      xp: 0,
      level: 1,
      badges: [],
      completedTasks: [],
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '7d' });

    // Don't send password back
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      xp: newUser.xp,
      level: newUser.level,
      hearts: newUser.hearts,
      badges: newUser.badges,
      completedTasks: newUser.completedTasks,
    };

    return res.status(201).json({
      msg: 'Signup successful',
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Signup failed' });
  }
};
// Login Controller

// Login Controller
export const loginController = async (req, res) => {
    console.log('🔍 Login attempt:', req.body);
    const { email, password } = req.body;
  
    if (!email || !password) {
      console.warn('⚠️ Missing email or password');
      return res.status(400).json({ msg: 'Email and password required' });
    }
  
    try {
      const user = await User.findOne({ email });
      console.log('👤 Fetched user:', user);
  
      if (!user) {
        console.warn('🚫 User not found');
        return res.status(400).json({ msg: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('🔐 Password match:', isMatch);
  
      if (!isMatch) {
        console.warn('🚫 Invalid credentials');
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        SECRET_KEY, // use this instead of JWT_SECRET
        { expiresIn: '2h' }
      );
  
      console.log('✅ JWT issued:', token);
  
      // Return user data along with xp, level, badges, and completedTasks
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          xp: user.xp, // Include XP
          level: user.level, // Include level
          hearts: user.hearts,
          badges: user.badges, // Include badges
          gameProgress:user.gameProgress,
          completedTasks: user.completedTasks // Include completed tasks
        }
      });
    } catch (err) {
      console.error('❌ Login error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }
  };
  

export const getMeController = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Failed to get user data" });
  }
};

// export const updateUserController = async (req, res) => {
//   const userId = req.userId; // from auth middleware
//   const { name, email } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     if (name) user.name = name;

//     if (email) {
//       // Check if email is used by another user
//       const existing = await User.findOne({ email });
//       if (existing && existing._id.toString() !== userId) {
//         return res.status(400).json({ msg: "Email already in use" });
//       }
//       user.email = email;
//     }

//     await user.save();

//     const userResponse = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       xp: user.xp,
//       level: user.level,
//       badges: user.badges,
//       completedTasks: user.completedTasks,
//       role: user.role,
//       gameProgress: user.gameProgress,
//     };

//     return res.json({ msg: "User updated successfully", user: userResponse });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return res.status(500).json({ msg: "Failed to update user" });
//   }
// };

// Update user profile (name and email)
export const updateProfileController = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.userId); // req.userId should be set from auth middleware

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check for email uniqueness if the email is being updated
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already in use" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        gameProgress: user.gameProgress,
        completedTasks: user.completedTasks,
      }
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password for security
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};