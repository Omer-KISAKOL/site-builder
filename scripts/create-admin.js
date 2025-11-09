#!/usr/bin/env node

/**
 * Admin User Creation Script
 * Bu script admin yetkisine sahip bir kullanıcı oluşturur veya mevcut kullanıcıya admin yetkisi verir
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const path = require('path');

// .env dosyasını yükle
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
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
    console.log('✅ Bağlantı başarılı!\n');

    console.log('Admin kullanıcısı oluşturma/güncelleme\n');
    
    const email = await question('Email: ');
    
    // Kullanıcı var mı kontrol et
    const userCheck = await client.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      const user = userCheck.rows[0];
      console.log(`\n✓ Kullanıcı bulundu: ${user.email} (Mevcut rol: ${user.role})`);
      
      const confirm = await question('Bu kullanıcıya admin yetkisi vermek istiyor musunuz? (e/h): ');
      
      if (confirm.toLowerCase() === 'e') {
        await client.query(
          'UPDATE users SET role = $1 WHERE id = $2',
          ['admin', user.id]
        );
        console.log('\n✅ Kullanıcı admin yapıldı!');
      } else {
        console.log('\n❌ İşlem iptal edildi');
      }
    } else {
      console.log('\n✓ Kullanıcı bulunamadı, yeni admin kullanıcısı oluşturulacak');
      
      const name = await question('İsim (opsiyonel): ');
      const password = await question('Şifre (min 6 karakter): ');

      if (password.length < 6) {
        console.log('\n❌ Şifre en az 6 karakter olmalı!');
        process.exit(1);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await client.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [email, hashedPassword, name || null, 'admin']
      );

      console.log('\n✅ Admin kullanıcısı başarıyla oluşturuldu!');
      console.log(`   ID: ${result.rows[0].id}`);
      console.log(`   Email: ${result.rows[0].email}`);
      console.log(`   İsim: ${result.rows[0].name || '-'}`);
      console.log(`   Rol: ${result.rows[0].role}`);
    }

    console.log('\n🚀 Artık bu kullanıcı ile giriş yapıp admin paneline erişebilirsiniz!\n');

  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await client.end();
  }
}

createAdmin();

