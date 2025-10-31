import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

/**
 * JWT token oluşturur
 * @param {Object} payload - Token içinde saklanacak veriler (örn: { userId: 1 })
 * @returns {string} JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * JWT token'ı doğrular ve içeriğini döner
 * @param {string} token - Doğrulanacak JWT token
 * @returns {Object} Token içeriği (payload)
 * @throws {Error} Token geçersiz veya süresi dolmuşsa
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

