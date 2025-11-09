import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Kullanıcıların admin olup olmadığını kontrol eden helper fonksiyon
async function checkAdminAuth(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return { error: 'Yetkisiz erişim', status: 401 };
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);

    // Kullanıcı bilgilerini getir
    const result = await pool.query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return { error: 'Kullanıcı bulunamadı', status: 404 };
    }

    const user = result.rows[0];

    // Admin kontrolü
    if (user.role !== 'admin') {
      return { error: 'Bu işlem için admin yetkisi gerekli', status: 403 };
    }

    return { user };
  } catch (error) {
    console.error('Admin auth check error:', error);
    return { error: 'Yetkilendirme hatası', status: 401 };
  }
}

// GET - Tüm kullanıcıları listele (sadece admin)
export async function GET(request) {
  const authCheck = await checkAdminAuth(request);
  if (authCheck.error) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    );
  }

  try {
    const result = await pool.query(
      'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
    );

    return NextResponse.json({
      users: result.rows
    });
  } catch (error) {
    console.error('Users list error:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar listelenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni kullanıcı oluştur (sadece admin)
export async function POST(request) {
  const authCheck = await checkAdminAuth(request);
  if (authCheck.error) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    );
  }

  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      );
    }

    // Password uzunluk kontrolü
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      );
    }

    // Kullanıcı var mı kontrol et
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanılıyor' },
        { status: 409 }
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [email, hashedPassword, name || null, role || 'user']
    );

    return NextResponse.json(
      { 
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: result.rows[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('User create error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}

