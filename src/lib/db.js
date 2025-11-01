import pkg from 'pg';
const { Pool } = pkg;

// Next.js otomatik olarak .env dosyasını yükler
// Tırnak işaretlerini temizle (eğer varsa)
const connectionString = process.env.DATABASE_URL?.replace(/^["']|["']$/g, '');

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Connection string'i direkt kullan (pg zaten destekliyor)
export const pool = new Pool({
  connectionString,
});

