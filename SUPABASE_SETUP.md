# Supabase Kurulum Rehberi

## Adım 1: Supabase Projesi Oluşturma

1. https://supabase.com adresine git
2. "Start your project" butonuna tıkla
3. GitHub ile giriş yap (veya email ile kayıt ol)
4. "New Project" butonuna tıkla
5. Organizasyon seç veya yeni oluştur

### Proje Ayarları
- **Name:** on-muhasebe
- **Database Password:** Güçlü bir şifre oluştur ve bir yere kaydet!
- **Region:** Europe West (Frankfurt) - Türkiye'ye en yakın
- **Pricing Plan:** Free (başlangıç için yeterli)

6. "Create new project" butonuna tıkla
7. Proje hazırlanırken bekle (~2 dakika)

## Adım 2: API Keys'i Kopyalama

1. Sol menüden **Settings** → **API** bölümüne git
2. Aşağıdaki bilgileri kopyala:

### Project URL
```
https://your-project-id.supabase.co
```

### Anon/Public Key (anon key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Adım 3: Environment Variables Güncelleme

`.env.local` dosyasını aç ve değerleri yapıştır:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Önemli:** `.env.local` dosyası Git'e eklenmez (.gitignore'da var)

## Adım 4: Database Şemasını Oluşturma

1. Supabase Dashboard'da sol menüden **SQL Editor** seç
2. "New Query" butonuna tıkla
3. `supabase-schema.sql` dosyasının içeriğini kopyala ve yapıştır
4. "RUN" butonuna tıkla (Ctrl+Enter veya Cmd+Enter)

### Başarılı Kurulum Kontrolü
- ✅ "Success. No rows returned" mesajı görmelisin
- ✅ Sol menüden **Table Editor** → 4 tablo görünmeli:
  - customers
  - jobs
  - payments
  - user_profiles

## Adım 5: Email Authentication Ayarları

1. Sol menüden **Authentication** → **Providers** seç
2. **Email** provider'ı bul
3. Ayarları kontrol et:
   - **Enable Email provider:** ✅ ON
   - **Confirm email:** ❌ OFF (geliştirme için, production'da ON yap)
   - **Secure email change:** ✅ ON

4. **Authentication** → **URL Configuration** seç
5. **Site URL** ayarını güncelle:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com` (deploy sonrası)

6. **Redirect URLs** ekle:
   ```
   http://localhost:3000/**
   https://your-domain.com/**
   ```

## Adım 6: İlk Admin Kullanıcısı Oluşturma

### Yöntem 1: Dashboard'dan (Önerilen)

1. **Authentication** → **Users** seç
2. "Add User" butonuna tıkla
3. Email ve şifre gir
4. "Create user" butonuna tıkla
5. **SQL Editor**'e git ve şu komutu çalıştır:

```sql
-- Kullanıcıyı admin yap (email'i kendi emailinle değiştir)
UPDATE user_profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

### Yöntem 2: Signup Sayfasından (Uygulama hazır olunca)

1. Uygulamayı çalıştır: `npm run dev`
2. `/signup` sayfasına git
3. Email ve şifre ile kayıt ol
4. Yukarıdaki SQL ile admin yap

## Adım 7: RLS Policies Test

RLS policies'in çalıştığını test et:

```sql
-- Mevcut kullanıcı olarak customers tablosunu sorgula
SELECT * FROM customers;

-- Başarılı olursa RLS çalışıyor demektir ✅
```

## Adım 8: Localhost'ta Test

1. Terminal'de proje dizinine git:
```bash
cd /Users/yusufgencay/Woltran/AzraYaldiz
```

2. Development server'ı başlat:
```bash
npm run dev
```

3. Browser'da aç: http://localhost:3000

4. Supabase bağlantısını test et (console'da hata olmamalı)

## Troubleshooting

### Hata: "supabase is not defined"
- `.env.local` dosyasını kontrol et
- Server'ı yeniden başlat: `npm run dev`

### Hata: "Invalid API key"
- Anon key'i doğru kopyaladığından emin ol
- Boşluk veya satır sonu olmamalı

### Hata: "relation does not exist"
- `supabase-schema.sql` dosyasını çalıştırdığından emin ol
- SQL Editor'de hata mesajını kontrol et

### RLS Hatası: "new row violates row-level security policy"
- Kullanıcı giriş yapmış mı kontrol et
- User profile oluşturulmuş mu kontrol et:
  ```sql
  SELECT * FROM user_profiles WHERE id = auth.uid();
  ```

## Production Deployment Checklist

Production'a almadan önce:

- [ ] **Confirm email:** ON yap
- [ ] **Site URL** production domain'e güncelle
- [ ] **Redirect URLs** production URL'leri ekle
- [ ] Database password'u güvenli bir yerde sakla
- [ ] Backup stratejisi belirle
- [ ] RLS policies'i tekrar gözden geçir

## Yardımcı Kaynaklar

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Not:** Bu dokümantasyon Sprint 1 için hazırlanmıştır. İlerleyen fazlarda güncellenecektir.
