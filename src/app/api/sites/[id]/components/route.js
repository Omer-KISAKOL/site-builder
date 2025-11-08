import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

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

    const { componentId, component_data } = body;

    // Site sahibi kontrolü
    const checkResult = await pool.query(
      `SELECT s.id FROM sites s
       INNER JOIN site_components sc ON sc.site_id = s.id
       WHERE s.id = $1 AND s.user_id = $2 AND sc.id = $3`,
      [id, decoded.userId, componentId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Component bulunamadı veya yetkiniz yok' },
        { status: 404 }
      );
    }

    // Component'i güncelle
    const result = await pool.query(
      `UPDATE site_components 
       SET component_data = $1
       WHERE id = $2
       RETURNING id, component_type, component_data, position`,
      [JSON.stringify(component_data), componentId]
    );

    return NextResponse.json({
      message: 'Component güncellendi',
      component: result.rows[0]
    });

  } catch (error) {
    console.error('Component PUT error:', error);
    return NextResponse.json(
      { error: 'Component güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

