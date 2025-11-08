# 🚀 Site Builder

Profesyonel web siteleri kolayca oluşturabileceğiniz güçlü bir site builder platformu.

## ✨ Özellikler

- 🎨 **Kolay Tasarım**: Navbar, sidebar ve content alanlarını kolayca düzenleyin
- ⚡ **Anlık Önizleme**: Değişikliklerinizi anında görün
- 🔒 **Güvenli**: JWT tabanlı kimlik doğrulama
- 💾 **PostgreSQL**: Güçlü veritabanı desteği
- 🎯 **Modern Stack**: Next.js 16, React 19, TailwindCSS 4

## 🛠️ Teknolojiler

- **Frontend**: Next.js 16, React 19
- **Styling**: TailwindCSS 4
- **Database**: PostgreSQL
- **Authentication**: JWT + bcryptjs
- **Package Manager**: pnpm

## 📦 Kurulum

### 1. Bağımlılıkları yükleyin

```bash
pnpm install
```

### 2. Environment değişkenlerini ayarlayın

`.env` dosyası oluşturun:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sitebuilder

# JWT Secret
JWT_SECRET=your-secret-key-change-this-in-production
```

### 3. Database'i başlatın

Önce PostgreSQL'de database oluşturun:

```sql
CREATE DATABASE sitebuilder;
```

Sonra tabloları oluşturun:

```bash
node scripts/init-db.js
```

### 4. Development server'ı başlatın

```bash
pnpm dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
site-builder/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   └── sites/           # Site management endpoints
│   │   ├── dashboard/           # Dashboard sayfası
│   │   ├── login/               # Login sayfası
│   │   ├── register/            # Register sayfası
│   │   └── sites/               # Site yönetim sayfaları
│   │       ├── create/          # Yeni site oluşturma
│   │       └── [id]/
│   │           ├── edit/        # Site düzenleme
│   │           └── preview/     # Site önizleme
│   ├── components/              # React componentleri
│   │   └── site/               # Site render componentleri
│   │       ├── Navbar.js
│   │       ├── Sidebar.js
│   │       └── Content.js
│   ├── lib/                     # Utility fonksiyonlar
│   │   ├── db.js               # Database connection
│   │   ├── auth.js             # Auth utilities
│   │   └── schema.sql          # Database schema
│   └── middleware.js            # Next.js middleware
├── scripts/
│   └── init-db.js              # Database initialization
└── package.json
```

## 🎯 Kullanım

### 1. Kayıt Olun

Ana sayfadan "Ücretsiz Başla" butonuna tıklayarak kayıt olun.

### 2. Site Oluşturun

Dashboard'da "Yeni Site Oluştur" butonuna tıklayın ve site bilgilerinizi girin.

### 3. Site Düzenleyin

- **Navbar**: Logo ve menü öğelerini düzenleyin
- **Sidebar**: Yan menü öğelerini ekleyin/düzenleyin
- **Content**: Hero, text, cards gibi bölümler ekleyin

### 4. Önizleyin ve Yayınlayın

"Önizle" butonuyla sitenizin son halini görün.

## 🗄️ Database Schema

### Users Tablosu
- Kullanıcı bilgileri (email, password, name)

### Sites Tablosu
- Site bilgileri (name, domain, description)
- user_id (foreign key)

### Site_Components Tablosu
- Component verileri (navbar, sidebar, content)
- JSON formatında component_data
- site_id (foreign key)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/logout` - Çıkış
- `GET /api/auth/me` - Kullanıcı bilgileri

### Sites
- `GET /api/sites` - Kullanıcının tüm siteleri
- `POST /api/sites` - Yeni site oluştur
- `GET /api/sites/[id]` - Site detayları
- `PUT /api/sites/[id]` - Site güncelle
- `DELETE /api/sites/[id]` - Site sil

### Components
- `PUT /api/sites/[id]/components` - Component güncelle

## 🚧 Geliştirme Notları

Bu proje başlangıç aşamasındadır ve sürekli geliştirilmektedir. Gelecek özellikler:

- [ ] Daha fazla component tipi (gallery, form, footer vb.)
- [ ] Drag & drop interface
- [ ] Template library
- [ ] SEO ayarları
- [ ] Custom domain desteği
- [ ] SSL sertifikaları
- [ ] Analitik dashboard
- [ ] Çoklu dil desteği

## 📝 Lisans

Bu proje özel kullanım içindir.

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için lütfen önce bir issue açın.

---

**Not**: Production ortamında kullanmadan önce:
- JWT_SECRET'i güçlü bir değerle değiştirin
- Database şifrelerini güvenli tutun
- HTTPS kullanın
- Environment değişkenlerini asla commit etmeyin
