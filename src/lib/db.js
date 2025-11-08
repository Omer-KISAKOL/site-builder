import pkg from 'pg';
const { Pool } = pkg;

// Next.js otomatik olarak .env dosyasını yükler
// .env.local > .env öncelik sırasıyla
const dbUrl = process.env.DATABASE_URL?.replace(/^["']|["']$/g, '');

if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Connection string'i manuel parse et
// Format: postgresql://username:password@host:port/database
const match = dbUrl.match(/^postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);

if (!match) {
  throw new Error('Invalid DATABASE_URL format');
}

const [, user, password, host, port, database] = match;

// Pool'u ayrı parametrelerle oluştur
export const pool = new Pool({
  user,
  password,
  host,
  port: parseInt(port),
  database,
});

