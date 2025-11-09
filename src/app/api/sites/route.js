import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request) {
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

    // Kullanıcının sitelerini getir
    const result = await pool.query(
      `SELECT id, name, domain, description, is_published, created_at, updated_at 
       FROM sites 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [decoded.userId]
    );

    return NextResponse.json({
      sites: result.rows
    });

  } catch (error) {
    console.error('Sites GET error:', error);
    return NextResponse.json(
      { error: 'Siteler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
    const body = await request.json();

    const { name, domain, description } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Site adı gerekli' },
        { status: 400 }
      );
    }

    // Yeni site oluştur
    const result = await pool.query(
      `INSERT INTO sites (user_id, name, domain, description) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, domain, description, is_published, created_at`,
      [decoded.userId, name.trim(), domain?.trim() || null, description?.trim() || null]
    );

    const newSite = result.rows[0];

    // Varsayılan componentler oluştur
    await pool.query(
      `INSERT INTO site_components (site_id, component_type, component_data, position) 
       VALUES 
         ($1, 'navbar', $2, 1),
         ($1, 'sidebar', $3, 2),
         ($1, 'content', $4, 3)`,
      [
        newSite.id,
        JSON.stringify({
          logo: 'Site Logo',
          items: [
            { label: 'Ana Sayfa', link: '/' },
            { label: 'Hakkımızda', link: '/hakkimizda' },
            { label: 'İletişim', link: '/iletisim' }
          ],
          style: {
            backgroundColor: '#ffffff',
            textColor: '#000000'
          }
        }),
        JSON.stringify({
          title: 'Menü',
          items: [
            { label: 'Dashboard', link: '/dashboard', icon: 'home' },
            { label: 'Ayarlar', link: '/settings', icon: 'settings' }
          ],
          style: {
            backgroundColor: '#f8f9fa',
            textColor: '#000000'
          }
        }),
        JSON.stringify({
          sections: [
            {
              type: 'hero',
              title: 'Hoş Geldiniz',
              subtitle: 'Bu bir demo içeriktir',
              buttonText: 'Başlayın',
              buttonLink: '#'
            }
          ]
        })
      ]
    );

    return NextResponse.json({
      message: 'Site başarıyla oluşturuldu',
      site: newSite
    }, { status: 201 });

  } catch (error) {
    console.error('Site POST error:', error);
    return NextResponse.json(
      { error: 'Site oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}

