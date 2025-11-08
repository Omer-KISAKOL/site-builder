import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    const { id } = await params;

    // Site bilgisini getir
    const siteResult = await pool.query(
      `SELECT id, name, domain, description, is_published, created_at, updated_at 
       FROM sites 
       WHERE id = $1 AND user_id = $2`,
      [id, decoded.userId]
    );

    if (siteResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Site bulunamadı' },
        { status: 404 }
      );
    }

    // Site componentlerini getir
    const componentsResult = await pool.query(
      `SELECT id, component_type, component_data, position, is_active 
       FROM site_components 
       WHERE site_id = $1 
       ORDER BY position ASC`,
      [id]
    );

    return NextResponse.json({
      site: siteResult.rows[0],
      components: componentsResult.rows
    });

  } catch (error) {
    console.error('Site GET error:', error);
    return NextResponse.json(
      { error: 'Site bilgisi alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    const { id } = await params;
    const body = await request.json();

    const { name, domain, description, is_published } = body;

    // Site sahibi kontrolü
    const checkResult = await pool.query(
      'SELECT id FROM sites WHERE id = $1 AND user_id = $2',
      [id, decoded.userId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Site bulunamadı veya yetkiniz yok' },
        { status: 404 }
      );
    }

    // Site bilgilerini güncelle
    const result = await pool.query(
      `UPDATE sites 
       SET name = COALESCE($1, name),
           domain = COALESCE($2, domain),
           description = COALESCE($3, description),
           is_published = COALESCE($4, is_published)
       WHERE id = $5 AND user_id = $6
       RETURNING id, name, domain, description, is_published, updated_at`,
      [name, domain, description, is_published, id, decoded.userId]
    );

    return NextResponse.json({
      message: 'Site güncellendi',
      site: result.rows[0]
    });

  } catch (error) {
    console.error('Site PUT error:', error);
    return NextResponse.json(
      { error: 'Site güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    const { id } = await params;

    // Site sahibi kontrolü ve silme
    const result = await pool.query(
      'DELETE FROM sites WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, decoded.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Site bulunamadı veya yetkiniz yok' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Site silindi'
    });

  } catch (error) {
    console.error('Site DELETE error:', error);
    return NextResponse.json(
      { error: 'Site silinirken hata oluştu' },
      { status: 500 }
    );
  }
}

