import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Accept both id and userId
    req.userId = decoded.userId || decoded.id;

    if (!req.userId) {
      return res.status(401).json({ msg: 'Invalid token payload' });
    }

    req.user = decoded; // Optional if you need full info
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};
