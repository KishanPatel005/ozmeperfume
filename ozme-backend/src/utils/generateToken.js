import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 * @param {string} userId - User ID
 * @param {string} secret - JWT secret (optional, defaults to JWT_SECRET)
 * @returns {string} JWT token
 */
export const generateToken = (userId, secret = null) => {
  const jwtSecret = secret || process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

