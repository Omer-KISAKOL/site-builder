#!/usr/bin/env node

/**
 * Database Initialization Script
 * Bu script database tablolarını oluşturur
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// .env dosyasını yükle
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log('🔌 Veritabanına bağlanılıyor...');
    await client.connect();
    console.log('✅ Bağlantı başarılı!');

    // Schema dosyasını oku
    const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 Tablolar oluşturuluyor...');
    await client.query(schema);
    console.log('✅ Tablolar başarıyla oluşturuldu!');

    // Tabloları listele
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📋 Oluşturulan tablolar:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('\n✨ Database başlatma işlemi tamamlandı!');
    console.log('🚀 Artık uygulamanızı başlatabilirsiniz: pnpm dev\n');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDatabase();

