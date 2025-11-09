#!/usr/bin/env node

/**
 * Migration Script - Add name and role columns to users table
 * Bu script users tablosuna name ve role kolonlarını ekler
 */

const { Client } = require('pg');
const path = require('path');

// .env dosyasını yükle
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function migrate() {
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

    console.log('\n📝 Kolon kontrolleri yapılıyor...');

    // name kolonu var mı kontrol et
    const nameCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'name';
    `);

    if (nameCheck.rows.length === 0) {
      console.log('➕ name kolonu ekleniyor...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN name VARCHAR(255);
      `);
      console.log('✅ name kolonu eklendi');
    } else {
      console.log('✓ name kolonu zaten mevcut');
    }

    // role kolonu var mı kontrol et
    const roleCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role';
    `);

    if (roleCheck.rows.length === 0) {
      console.log('➕ role kolonu ekleniyor...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(50) DEFAULT 'user';
      `);
      console.log('✅ role kolonu eklendi');

      // Mevcut kullanıcılar için role değerini güncelle
      console.log('🔄 Mevcut kullanıcılar için role değerleri güncelleniyor...');
      await client.query(`
        UPDATE users 
        SET role = 'user' 
        WHERE role IS NULL;
      `);
      console.log('✅ Role değerleri güncellendi');
    } else {
      console.log('✓ role kolonu zaten mevcut');
    }

    // created_at kolonu var mı kontrol et (veritabanında createdAt olabilir)
    const createdAtCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'created_at';
    `);

    if (createdAtCheck.rows.length === 0) {
      const createdAtCamelCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'createdAt';
      `);

      if (createdAtCamelCheck.rows.length > 0) {
        console.log('🔄 createdAt kolonu created_at olarak yeniden adlandırılıyor...');
        await client.query(`
          ALTER TABLE users 
          RENAME COLUMN "createdAt" TO created_at;
        `);
        console.log('✅ Kolon yeniden adlandırıldı');
      } else {
        console.log('➕ created_at kolonu ekleniyor...');
        await client.query(`
          ALTER TABLE users 
          ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        `);
        console.log('✅ created_at kolonu eklendi');
      }
    } else {
      console.log('✓ created_at kolonu zaten mevcut');
    }

    // updated_at kolonu var mı kontrol et
    const updatedAtCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'updated_at';
    `);

    if (updatedAtCheck.rows.length === 0) {
      console.log('➕ updated_at kolonu ekleniyor...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
      console.log('✅ updated_at kolonu eklendi');
    } else {
      console.log('✓ updated_at kolonu zaten mevcut');
    }

    // Index'leri kontrol et ve ekle
    console.log('\n📊 Index kontrolleri yapılıyor...');
    
    const emailIndexCheck = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'users' AND indexname = 'idx_users_email';
    `);

    if (emailIndexCheck.rows.length === 0) {
      console.log('➕ idx_users_email index\'i ekleniyor...');
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
      console.log('✅ Email index\'i eklendi');
    } else {
      console.log('✓ idx_users_email zaten mevcut');
    }

    const roleIndexCheck = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'users' AND indexname = 'idx_users_role';
    `);

    if (roleIndexCheck.rows.length === 0) {
      console.log('➕ idx_users_role index\'i ekleniyor...');
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);');
      console.log('✅ Role index\'i eklendi');
    } else {
      console.log('✓ idx_users_role zaten mevcut');
    }

    // Trigger kontrolü
    console.log('\n🔧 Trigger kontrolleri yapılıyor...');
    
    const triggerCheck = await client.query(`
      SELECT trigger_name 
      FROM information_schema.triggers 
      WHERE event_object_table = 'users' AND trigger_name = 'update_users_updated_at';
    `);

    if (triggerCheck.rows.length === 0) {
      console.log('➕ Trigger ekleniyor...');
      
      // Önce fonksiyonu oluştur
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);

      // Sonra trigger'ı ekle
      await client.query(`
        CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('✅ Trigger eklendi');
    } else {
      console.log('✓ Trigger zaten mevcut');
    }

    // Son durum
    console.log('\n📋 Users tablosunun son durumu:');
    const columns = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    console.log('\n✨ Migration başarıyla tamamlandı!');
    console.log('🚀 Artık uygulamanızı başlatabilirsiniz: pnpm dev\n');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();

