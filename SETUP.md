# 🚀 Site Builder - Kurulum Rehberi

## Adım 1: Bağımlılıkları Yükleyin

```bash
pnpm install
```

## Adım 2: PostgreSQL Kurulumu

### PostgreSQL'in kurulu olduğundan emin olun:

```bash
psql --version
```

### PostgreSQL'e bağlanın ve database oluşturun:

```bash
psql -U postgres
```

PostgreSQL konsolunda:

```sql
CREATE DATABASE sitebuilder;
\q
```

## Adım 3: Environment Değişkenlerini Ayarlayın

Proje kök dizininde `.env` dosyası oluşturun:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=sitebuilder

# JWT Secret (Production'da mutlaka değiştirin!)
JWT_SECRET=your-secret-key-change-this-in-production
```

**ÖNEMLİ**: 
- `DB_PASSWORD` değerini kendi PostgreSQL şifrenizle değiştirin
- `JWT_SECRET` değerini güçlü bir random string ile değiştirin

## Adım 4: Database Tablolarını Oluşturun

```bash
pnpm run init-db
```

Bu komut şunları yapacak:
- Database'e bağlanacak
- `users`, `sites`, ve `site_components` tablolarını oluşturacak
- Gerekli index'leri ve trigger'ları kuracak

Başarılı çıktı örneği:
```
🔌 Veritabanına bağlanılıyor...
✅ Bağlantı başarılı!
📝 Tablolar oluşturuluyor...
✅ Tablolar başarıyla oluşturuldu!

📋 Oluşturulan tablolar:
  - users
  - sites
  - site_components
```

## Adım 5: Development Server'ı Başlatın

```bash
pnpm dev
```

Server başarıyla başladığında:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
```

## Adım 6: Uygulamayı Kullanın

1. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın
2. "Ücretsiz Başla" butonuna tıklayın
3. Kayıt olun (ilk kullanıcı)
4. Dashboard'a yönlendirileceksiniz
5. "Yeni Site Oluştur" butonuna tıklayın
6. Site bilgilerinizi girin
7. Navbar, Sidebar ve Content bölümlerini düzenleyin
8. "Önizle" butonuyla sitenizi görün

## 🐛 Sorun Giderme

### Database bağlantı hatası

**Hata**: `ECONNREFUSED` veya `password authentication failed`

**Çözüm**:
1. PostgreSQL'in çalıştığından emin olun:
   ```bash
   sudo systemctl status postgresql
   # veya
   sudo service postgresql status
   ```

2. `.env` dosyasındaki bilgilerin doğru olduğunu kontrol edin

3. PostgreSQL'e manuel bağlanmayı deneyin:
   ```bash
   psql -h localhost -U postgres -d sitebuilder
   ```

### Port 3000 kullanımda hatası

**Çözüm**: Farklı bir port kullanın:
```bash
PORT=3001 pnpm dev
```

### JWT Token hatası

**Çözüm**: 
1. Tarayıcı cookie'lerini temizleyin
2. Tekrar giriş yapın

## 📚 Database Schema

### users
- `id` (PRIMARY KEY)
- `email` (UNIQUE)
- `password` (hashed with bcrypt)
- `name`
- `created_at`

### sites
- `id` (PRIMARY KEY)
- `user_id` (FOREIGN KEY -> users.id)
- `name`
- `domain`
- `description`
- `is_published`
- `created_at`, `updated_at`

### site_components
- `id` (PRIMARY KEY)
- `site_id` (FOREIGN KEY -> sites.id)
- `component_type` (navbar, sidebar, content)
- `component_data` (JSONB)
- `position`
- `is_active`
- `created_at`, `updated_at`

## 🔒 Güvenlik Notları

### Development
- Default JWT secret kullanabilirsiniz
- Localhost'ta HTTP kullanabilirsiniz

### Production
- **MUTLAKA** güçlü bir JWT_SECRET kullanın
- **MUTLAKA** HTTPS kullanın
- Database şifrelerini güvenli tutun
- `.env` dosyasını asla commit etmeyin
- CORS ayarlarını yapın
- Rate limiting ekleyin

## 🎯 Sonraki Adımlar

1. ✅ Kurulumu tamamladınız
2. 🎨 İlk sitenizi oluşturun
3. 📖 [README.md](./README.md) dosyasını okuyun
4. 🚀 Geliştirmeye başlayın!

## 💡 İpuçları

- **Component Düzenleme**: Her değişiklik sonrası "Kaydet" butonuna basmayı unutmayın
- **Önizleme**: Preview sayfası yeni sekmede açılır
- **Renkler**: Color picker ile özel renkler seçebilirsiniz
- **Responsive**: Tüm componentler mobil uyumludur

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Bu dosyayı tekrar kontrol edin
2. Console loglarını inceleyin (F12 -> Console)
3. Database bağlantısını test edin

---

**Başarılar! 🎉**

