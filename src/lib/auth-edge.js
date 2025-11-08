import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Secret'ı Uint8Array'e çevir
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * JWT token'ı doğrular (Edge Runtime uyumlu)
 * @param {string} token - Doğrulanacak JWT token
 * @returns {Promise<Object>} Token içeriği (payload)
 * @throws {Error} Token geçersiz veya süresi dolmuşsa
 */
export async function verifyTokenEdge(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * JWT token oluşturur (Edge Runtime uyumlu)
 * @param {Object} payload - Token içinde saklanacak veriler
 * @returns {Promise<string>} JWT token
 */
export async function generateTokenEdge(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
  return token;
}

