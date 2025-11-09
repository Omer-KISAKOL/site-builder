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

// GET - Tek bir kullanıcının detaylarını getir
export async function GET(request, { params }) {
  const authCheck = await checkAdminAuth(request);
  if (authCheck.error) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    );
  }

  try {
    const { id } = await params;
    const result = await pool.query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error('User get error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı bilgileri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT - Kullanıcı bilgilerini güncelle
export async function PUT(request, { params }) {
  const authCheck = await checkAdminAuth(request);
  if (authCheck.error) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { email, name, role, password } = body;

    // Kullanıcı var mı kontrol et
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Email değiştiriliyorsa, başka birinin kullanıp kullanmadığını kontrol et
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        return NextResponse.json(
          { error: 'Bu email adresi başka bir kullanıcı tarafından kullanılıyor' },
          { status: 409 }
        );
      }
    }

    // Güncellenecek alanları hazırla
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }

    if (role !== undefined) {
      updates.push(`role = $${paramIndex++}`);
      values.push(role);
    }

    // Şifre güncelleniyorsa
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Şifre en az 6 karakter olmalı' },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramIndex++}`);
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Güncellenecek alan belirtilmedi' },
        { status: 400 }
      );
    }

    values.push(id);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, name, role, created_at
    `;

    const result = await pool.query(query, values);

    return NextResponse.json({
      message: 'Kullanıcı başarıyla güncellendi',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE - Kullanıcıyı sil
export async function DELETE(request, { params }) {
  const authCheck = await checkAdminAuth(request);
  if (authCheck.error) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    );
  }

  try {
    const { id } = await params;

    // Kendi kendini silmeye çalışıyor mu?
    if (authCheck.user.id === parseInt(id)) {
      return NextResponse.json(
        { error: 'Kendi hesabınızı silemezsiniz' },
        { status: 400 }
      );
    }

    // Kullanıcı var mı kontrol et
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcıyı sil (cascade ile siteleri de silinecek)
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    return NextResponse.json({
      message: 'Kullanıcı başarıyla silindi'
    });
  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı silinirken hata oluştu' },
      { status: 500 }
    );
  }
}

