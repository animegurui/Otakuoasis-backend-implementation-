import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header) return res.status(401).json({ message: 'Authorization header missing' });

    const token = header.split(' ')[1] || header;
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role || 'user' };
    return next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};
