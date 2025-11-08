# 📊 Site Builder - Proje Özeti

## 🎯 Proje Amacı

Kullanıcıların kod yazmadan profesyonel web siteleri oluşturabilecekleri bir **admin/yönetim paneli** uygulaması.

## ✅ Tamamlanan Özellikler

### 1. 🔐 Kimlik Doğrulama Sistemi
- Kullanıcı kaydı ve girişi
- JWT tabanlı authentication
- Güvenli password hashing (bcrypt)
- Session yönetimi (cookie-based)
- Protected routes (middleware)

### 2. 📊 Dashboard
- Kullanıcının tüm sitelerini listeleme
- Site oluşturma, düzenleme, silme
- Modern ve responsive UI
- Dark mode desteği

### 3. 🏗️ Site Oluşturma
- Temel site bilgileri (ad, domain, açıklama)
- Otomatik varsayılan component'ler
- Kullanıcı dostu form

### 4. ✏️ Site Builder/Editor
- **Navbar Editor**:
  - Logo/site adı düzenleme
  - Menü öğeleri ekleme/çıkarma/düzenleme
  - Renk özelleştirme (background, text)
  - Responsive tasarım

- **Sidebar Editor**:
  - Başlık düzenleme
  - Menü öğeleri yönetimi
  - Icon desteği
  - Renk özelleştirme

- **Content Editor**:
  - Hero section
  - Text sections
  - Card sections
  - Features sections
  - CTA sections
  - Kolay düzenleme interface'i

### 5. 👁️ Preview/Önizleme Sistemi
- Gerçek zamanlı site görüntüleme
- Tüm component'lerin render edilmesi
- Responsive görünüm
- Düzenleme moduna kolay geçiş

### 6. 🗄️ Database
- PostgreSQL veritabanı
- İyi tasarlanmış schema
- Foreign key ilişkileri
- Cascade delete
- Automatic timestamps
- JSON storage (component data)

### 7. 🎨 UI/UX
- Modern ve temiz tasarım
- TailwindCSS 4
- Dark mode
- Responsive design
- Smooth transitions
- User-friendly forms

## 📁 Dosya Yapısı

```
site-builder/
├── src/
│   ├── app/                          # Next.js Pages
│   │   ├── page.js                  # ✅ Ana sayfa (landing)
│   │   ├── layout.js                # ✅ Root layout
│   │   ├── dashboard/
│   │   │   └── page.js              # ✅ Dashboard
│   │   ├── login/
│   │   │   └── page.js              # ✅ Login sayfası
│   │   ├── register/
│   │   │   └── page.js              # ✅ Register sayfası
│   │   ├── sites/
│   │   │   ├── create/
│   │   │   │   └── page.js          # ✅ Yeni site oluşturma
│   │   │   └── [id]/
│   │   │       ├── edit/
│   │   │       │   └── page.js      # ✅ Site düzenleme
│   │   │       └── preview/
│   │   │           └── page.js      # ✅ Site önizleme
│   │   └── api/                     # API Routes
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── route.js     # ✅ Login endpoint
│   │       │   ├── register/
│   │       │   │   └── route.js     # ✅ Register endpoint
│   │       │   ├── logout/
│   │       │   │   └── route.js     # ✅ Logout endpoint
│   │       │   └── me/
│   │       │       └── route.js     # ✅ User info endpoint
│   │       └── sites/
│   │           ├── route.js         # ✅ Sites CRUD
│   │           └── [id]/
│   │               ├── route.js     # ✅ Site details
│   │               └── components/
│   │                   └── route.js # ✅ Component update
│   ├── components/
│   │   └── site/                    # Reusable Components
│   │       ├── Navbar.js            # ✅ Navbar component
│   │       ├── Sidebar.js           # ✅ Sidebar component
│   │       ├── Content.js           # ✅ Content component
│   │       └── index.js             # ✅ Exports
│   ├── lib/
│   │   ├── db.js                    # ✅ Database connection
│   │   ├── auth.js                  # ✅ Auth utilities
│   │   ├── auth-edge.js             # ✅ Edge auth
│   │   └── schema.sql               # ✅ Database schema
│   └── middleware.js                # ✅ Route protection
├── scripts/
│   └── init-db.js                   # ✅ DB initialization
├── package.json                     # ✅ Dependencies
├── README.md                        # ✅ Documentation
├── SETUP.md                         # ✅ Setup guide
└── PROJECT_OVERVIEW.md              # ✅ This file
```

## 🔄 Uygulama Akışı

### Kullanıcı Kaydı & Girişi
```
1. Kullanıcı ana sayfaya gelir
2. "Ücretsiz Başla" veya "Giriş Yap" seçer
3. Formu doldurur
4. Backend JWT token oluşturur
5. Token cookie'ye kaydedilir
6. Dashboard'a yönlendirilir
```

### Site Oluşturma
```
1. Dashboard'da "Yeni Site Oluştur" butonu
2. Site bilgilerini girer
3. POST /api/sites
4. Database'e site kaydedilir
5. Varsayılan component'ler oluşturulur
6. Edit sayfasına yönlendirilir
```

### Site Düzenleme
```
1. Edit sayfasında 3 tab: Navbar, Sidebar, Content
2. Her tab'da component verisi düzenlenir
3. "Kaydet" butonuna basılır
4. PUT /api/sites/[id]/components
5. Component_data JSON olarak kaydedilir
6. UI güncellenir
```

### Site Önizleme
```
1. "Önizle" butonuna basılır
2. Yeni sekmede preview sayfası açılır
3. GET /api/sites/[id]
4. Component'ler render edilir
5. Gerçek site görünümü gösterilir
```

## 🗃️ Database Şeması

### users
```sql
id          SERIAL PRIMARY KEY
email       VARCHAR(255) UNIQUE NOT NULL
password    VARCHAR(255) NOT NULL (bcrypt hashed)
name        VARCHAR(255)
created_at  TIMESTAMP DEFAULT NOW()
```

### sites
```sql
id           SERIAL PRIMARY KEY
user_id      INTEGER REFERENCES users(id) CASCADE
name         VARCHAR(255) NOT NULL
domain       VARCHAR(255)
description  TEXT
is_published BOOLEAN DEFAULT FALSE
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()
```

### site_components
```sql
id              SERIAL PRIMARY KEY
site_id         INTEGER REFERENCES sites(id) CASCADE
component_type  VARCHAR(50) NOT NULL
component_data  JSONB NOT NULL DEFAULT '{}'
position        INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT TRUE
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | ❌ | Kullanıcı girişi |
| POST | `/api/auth/logout` | ✅ | Çıkış yapma |
| GET | `/api/auth/me` | ✅ | Kullanıcı bilgileri |

### Sites
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/sites` | ✅ | Tüm siteleri listele |
| POST | `/api/sites` | ✅ | Yeni site oluştur |
| GET | `/api/sites/[id]` | ✅ | Site detayları |
| PUT | `/api/sites/[id]` | ✅ | Site bilgilerini güncelle |
| DELETE | `/api/sites/[id]` | ✅ | Site sil |
| PUT | `/api/sites/[id]/components` | ✅ | Component güncelle |

## 🎨 Component Yapısı

### Navbar Component Data
```json
{
  "logo": "Site Logo",
  "items": [
    { "label": "Ana Sayfa", "link": "/" },
    { "label": "Hakkımızda", "link": "/about" }
  ],
  "style": {
    "backgroundColor": "#ffffff",
    "textColor": "#000000"
  }
}
```

### Sidebar Component Data
```json
{
  "title": "Menü",
  "items": [
    { "label": "Dashboard", "link": "/dashboard", "icon": "home" },
    { "label": "Ayarlar", "link": "/settings", "icon": "settings" }
  ],
  "style": {
    "backgroundColor": "#f8f9fa",
    "textColor": "#000000"
  }
}
```

### Content Component Data
```json
{
  "sections": [
    {
      "type": "hero",
      "title": "Hoş Geldiniz",
      "subtitle": "Bu bir demo içeriktir",
      "buttonText": "Başlayın",
      "buttonLink": "#"
    },
    {
      "type": "cards",
      "title": "Özellikler",
      "cards": [
        {
          "title": "Hızlı",
          "description": "Çok hızlı",
          "icon": "⚡"
        }
      ]
    }
  ]
}
```

## 🚀 Gelecek Özellikler (Roadmap)

### Kısa Vadeli
- [ ] Drag & drop component sırası
- [ ] Daha fazla content section tipi
- [ ] Image upload
- [ ] Template library
- [ ] Footer component
- [ ] Responsive preview modes

### Orta Vadeli
- [ ] Custom domain management
- [ ] SSL certificate handling
- [ ] SEO settings
- [ ] Analytics dashboard
- [ ] Form builder
- [ ] Blog component
- [ ] E-commerce components

### Uzun Vadeli
- [ ] Multi-language support
- [ ] Team collaboration
- [ ] Version history
- [ ] A/B testing
- [ ] Advanced analytics
- [ ] White-label solution
- [ ] Marketplace (themes/plugins)

## 💻 Teknoloji Stack

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TailwindCSS 4** - Styling
- **JavaScript** - Language

### Backend
- **Next.js API Routes** - Backend API
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### DevOps
- **pnpm** - Package manager
- **Git** - Version control

## 📈 Performans & Güvenlik

### Güvenlik
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ SQL injection koruması (parameterized queries)
- ✅ CSRF koruması
- ✅ XSS koruması
- ✅ Secure cookie handling
- ✅ Environment variables

### Performans
- ✅ Server-side rendering
- ✅ Database indexing
- ✅ Efficient queries
- ✅ Component memoization
- ✅ Lazy loading

## 🎓 Öğrenilen Teknolojiler

Bu projede kullanılan teknolojiler:
1. Next.js 16 App Router
2. Server Components & Client Components
3. PostgreSQL & SQL
4. JWT Authentication
5. Cookie-based sessions
6. Middleware
7. API Routes
8. TailwindCSS 4
9. Form handling
10. State management
11. JSONB data storage
12. Database relationships

## 📝 Notlar

- Proje **basit** bir seviyede başladı
- **Detaylandırılabilir** yapıda tasarlandı
- Tüm temel özellikler çalışır durumda
- Production-ready için ek güvenlik ve optimizasyonlar gerekli
- Kod yapısı clean ve maintainable

---

**Proje Durumu**: ✅ MVP Tamamlandı
**Versiyon**: 0.1.0
**Tarih**: 2025

