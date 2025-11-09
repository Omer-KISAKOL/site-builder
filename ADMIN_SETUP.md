# 👑 Admin Panel Kurulum Rehberi

## 🎯 Genel Bakış

Site Builder artık admin paneli ile kullanıcı yönetimi özelliğine sahip. Admin kullanıcıları tüm kullanıcıları görebilir, düzenleyebilir ve silebilir.

## 🔧 Kurulum Adımları

### 1. Veritabanı Migration'ını Çalıştır

Öncelikle mevcut `users` tablosuna `name` ve `role` kolonlarını ekleyen migration'ı çalıştırmalısınız:

```bash
pnpm migrate
```

Bu komut:
- ✅ `name` kolonunu ekler (VARCHAR(255))
- ✅ `role` kolonunu ekler (VARCHAR(50), default: 'user')
- ✅ `created_at` ve `updated_at` kolonlarını kontrol eder/ekler
- ✅ Gerekli index'leri oluşturur
- ✅ Update trigger'larını ekler

### 2. Admin Kullanıcısı Oluştur

Migration'dan sonra, bir admin kullanıcısı oluşturmalısınız:

```bash
pnpm create-admin
```

Bu komut size:
1. Email adresi soracak
2. Eğer kullanıcı varsa, admin yetkisi verme seçeneği sunacak
3. Eğer kullanıcı yoksa, yeni admin kullanıcısı oluşturacak

**Örnek kullanım:**

```bash
$ pnpm create-admin

Email: admin@example.com
İsim (opsiyonel): Admin User
Şifre (min 6 karakter): admin123

✅ Admin kullanıcısı başarıyla oluşturuldu!
   ID: 1
   Email: admin@example.com
   İsim: Admin User
   Rol: admin
```

## 🚀 Kullanım

### Admin Paneline Erişim

1. Admin kullanıcısı ile giriş yapın
2. Dashboard'da sağ üstte **👑 Admin Panel** butonunu göreceksiniz
3. Bu butona tıklayarak admin paneline erişin

### Admin Panel Özellikleri

#### 📋 Kullanıcı Listesi
- Tüm kullanıcıları tablo halinde görüntüleme
- Kullanıcı ID, email, isim, rol ve oluşturulma tarihi bilgileri
- Rol badge'leri (admin mor, user gri)

#### ➕ Yeni Kullanıcı Ekleme
1. **+ Yeni Kullanıcı Ekle** butonuna tıklayın
2. Form alanlarını doldurun:
   - **Email** (zorunlu)
   - **İsim** (opsiyonel)
   - **Şifre** (zorunlu, min 6 karakter)
   - **Rol** (user veya admin)
3. **Ekle** butonuna tıklayın

#### ✏️ Kullanıcı Düzenleme
1. Kullanıcının yanındaki **Düzenle** butonuna tıklayın
2. Formdaki bilgileri güncelleyin:
   - Email değiştirilebilir
   - İsim eklenebilir/değiştirilebilir
   - Şifre değiştirmek isterseniz yeni şifre girin (boş bırakılırsa değişmez)
   - Rol değiştirilebilir (user ↔ admin)
3. **Güncelle** butonuna tıklayın

#### 🗑️ Kullanıcı Silme
1. Kullanıcının yanındaki **Sil** butonuna tıklayın
2. Onay penceresinde **Tamam**'a tıklayın
3. ⚠️ **DİKKAT:** Kullanıcı silindiğinde tüm siteleri de CASCADE ile silinir!
4. ℹ️ Kendi kendinizi silemezsiniz

## 🔒 Güvenlik

### Yetkilendirme

- **Admin API Endpoint'leri:** `/api/admin/*`
  - Sadece `role = 'admin'` olan kullanıcılar erişebilir
  - Her istekte JWT token ve rol kontrolü yapılır
  - Yetkisiz erişimde 403 Forbidden döner

- **Admin Sayfası:** `/admin`
  - Client-side'da da admin kontrolü yapılır
  - Admin değilse otomatik olarak dashboard'a yönlendirilir

### API Endpoint'leri

#### GET /api/admin/users
Tüm kullanıcıları listeler (sadece admin).

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/admin/users
Yeni kullanıcı oluşturur (sadece admin).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "user"
}
```

#### GET /api/admin/users/[id]
Kullanıcı detaylarını getirir (sadece admin).

#### PUT /api/admin/users/[id]
Kullanıcı bilgilerini günceller (sadece admin).

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "name": "New Name",
  "password": "newpassword",
  "role": "admin"
}
```

**Not:** Tüm alanlar opsiyoneldir. Sadece gönderdikleriniz güncellenir.

#### DELETE /api/admin/users/[id]
Kullanıcıyı siler (sadece admin).

**Not:** Kendi kendini silmeye çalışan admin için 400 Bad Request döner.

## 📊 Database Schema

### users Tablosu

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Trigger
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🎨 UI/UX

- **Modern tasarım:** TailwindCSS 4 ile responsive ve temiz arayüz
- **Dark mode:** Otomatik dark mode desteği
- **Modal'lar:** Kullanıcı ekleme/düzenleme için modal pencereler
- **Konfirmasyon:** Kritik işlemler (silme) için onay pencereleri
- **Feedback:** Her işlem sonrası kullanıcıya geri bildirim

## 🐛 Sorun Giderme

### Migration çalışmıyor
```bash
# Veritabanı bağlantı bilgilerinizi kontrol edin
cat .env

# Migration'ı tekrar çalıştırın
pnpm migrate
```

### Admin paneline erişemiyorum
1. Kullanıcınızın role'ünü kontrol edin:
   ```sql
   SELECT id, email, role FROM users WHERE email = 'your@email.com';
   ```
2. Eğer role 'user' ise, 'admin' yapın:
   ```bash
   pnpm create-admin
   ```

### API 403 hatası alıyorum
- JWT token'ınızın geçerli olduğundan emin olun
- Çıkış yapıp tekrar giriş yapmayı deneyin
- Browser console'da hata mesajlarını kontrol edin

## 📝 Notlar

- ✅ Tüm API endpoint'leri admin yetkisi kontrol eder
- ✅ Kendi kendinizi silemezsiniz
- ✅ Kullanıcı silindiğinde tüm siteleri de CASCADE ile silinir
- ✅ Şifre güncellemesi opsiyoneldir
- ✅ Email uniqueness kontrolü yapılır
- ✅ Tüm işlemler loglenir (console)

## 🚀 Gelecek Özellikler

- [ ] Toplu kullanıcı işlemleri (bulk delete, bulk role change)
- [ ] Kullanıcı arama ve filtreleme
- [ ] Kullanıcı aktivite log'ları
- [ ] Email doğrulama sistemi
- [ ] İki faktörlü kimlik doğrulama (2FA)
- [ ] Kullanıcı profil resmi
- [ ] CSV export/import

---

**Proje:** Site Builder v0.1.0  
**Tarih:** 2025

