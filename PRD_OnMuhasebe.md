# Ön Muhasebe Sistemi - Product Requirements Document (PRD)

## 📊 Proje Özeti

**Proje Adı:** Ön Muhasebe ve İş Takip Sistemi
**Amaç:** Gelen işleri takip etmek, müşteri cari hesaplarını yönetmek ve ödeme durumlarını kontrol etmek
**Platform:** Web (Mobil Responsive)
**Hedef Kullanıcı:** 1-2 muhasebe personeli (Admin + User rolleri)
**Müşteri Kapasitesi:** 100+ müşteri

---

## 🎯 Temel Gereksinimler

### Fonksiyonel Gereksinimler

#### 1. İş Takibi
- ✅ Yeni iş kaydı oluşturma
- ✅ İş detayları: Tarih, Müşteri Adı, İş Adı, İş Detayları, Fiyat
- ✅ İş durumu: Bekliyor / Tamamlandı
- ✅ İş listesi ve filtreleme
- ✅ İş düzenleme ve silme

#### 2. Müşteri Yönetimi
- ✅ Müşteri ekleme/düzenleme/silme
- ✅ Müşteri iletişim bilgileri
- ✅ Müşteri notları
- ✅ Müşteri arama fonksiyonu

#### 3. Cari Hesap Yönetimi
- ✅ Borç/Alacak takibi
- ✅ Ödeme kaydı (Nakit, Havale, Çek)
- ✅ Müşteri bazında bakiye hesaplama
- ✅ Ödeme geçmişi
- ✅ Vadeli ödeme desteği (opsiyonel)

#### 4. Raporlama
- ✅ Müşteri bazında bakiye durumu
- ✅ Ödeme geçmişi raporu
- ✅ Bekleyen işler raporu
- ✅ Dashboard istatistikleri (özet görünüm)

#### 5. Kullanıcı Yönetimi
- ✅ Admin ve User rolleri
- ✅ Email/Password ile giriş
- ✅ Role-based access control (RBAC)
- ✅ Güvenli authentication

---

## 🏗️ Teknik Mimari

### Frontend Stack
```
Next.js 14+ (App Router)
├── React 18+
├── TypeScript
├── Tailwind CSS
├── shadcn/ui (UI Components)
├── React Hook Form + Zod (Form Validation)
└── Axios / Fetch (API Calls)
```

### Backend Stack
```
Next.js API Routes (Serverless)
├── Supabase PostgreSQL (Database)
├── Supabase Auth (Authentication)
├── Row Level Security (RLS)
└── Edge Runtime
```

### Deployment
```
Vercel (Frontend + API)
├── Automatic HTTPS
├── Environment Variables
├── Edge Network
└── Continuous Deployment
```

---

## 🗄️ Database Schema

### **users** (Supabase Auth Integration)
```sql
id: UUID (PK)
email: VARCHAR
role: ENUM('admin', 'user')
created_at: TIMESTAMP
```

### **customers**
```sql
id: UUID (PK)
name: VARCHAR (Müşteri Adı)
contact_info: TEXT (İletişim Bilgileri)
notes: TEXT (Notlar)
created_at: TIMESTAMP
updated_at: TIMESTAMP
created_by: UUID (FK → users.id)
```

### **jobs**
```sql
id: UUID (PK)
customer_id: UUID (FK → customers.id)
job_name: VARCHAR (İş Adı)
job_details: TEXT (İş Detayları)
price: DECIMAL (Fiyat)
status: ENUM('bekliyor', 'tamamlandı')
created_date: DATE (İş Tarihi)
completed_date: DATE (Tamamlanma Tarihi)
created_by: UUID (FK → users.id)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### **payments**
```sql
id: UUID (PK)
customer_id: UUID (FK → customers.id)
job_id: UUID (FK → jobs.id, NULLABLE)
amount: DECIMAL (Ödeme Tutarı)
payment_type: ENUM('nakit', 'havale', 'çek')
payment_date: DATE (Ödeme Tarihi)
notes: TEXT (Notlar)
created_by: UUID (FK → users.id)
created_at: TIMESTAMP
```

### **account_summary** (VIEW)
```sql
customer_id: UUID
customer_name: VARCHAR
total_jobs: DECIMAL (Toplam İş Tutarı)
total_payments: DECIMAL (Toplam Ödemeler)
balance: DECIMAL (Bakiye = total_jobs - total_payments)
```

---

## 🔐 Güvenlik Gereksinimleri

### Authentication & Authorization
- ✅ Supabase Auth (Email/Password)
- ✅ JWT Token-based authentication
- ✅ Row Level Security (RLS) policies
- ✅ Role-based access control (Admin/User)

### API Security
- ✅ HTTPS only (TLS 1.3)
- ✅ Rate limiting (DDoS protection)
- ✅ Input validation (Zod schemas)
- ✅ SQL injection prevention (Parameterized queries)
- ✅ CORS configuration

### Frontend Security
- ✅ XSS protection (React auto-escaping)
- ✅ CSRF tokens
- ✅ Secure headers (CSP, HSTS, X-Frame-Options)
- ✅ Content Security Policy

### Data Security
- ✅ Encrypted connections (SSL/TLS)
- ✅ Secure environment variables
- ✅ No sensitive data in frontend

---

## 📱 Sayfa Yapısı

### Public Pages
```
/login - Giriş Sayfası
```

### Protected Pages (Admin + User)
```
/dashboard          - Ana Sayfa (Özet İstatistikler)
/customers          - Müşteri Listesi
/customers/[id]     - Müşteri Detay (Cari Hesap, İşler, Ödemeler)
/jobs               - İş Listesi (Filtreleme: Bekliyor/Tamamlandı)
/jobs/new           - Yeni İş Oluştur
/jobs/[id]          - İş Detay/Düzenle
/payments           - Ödeme Kayıt Sayfası
/reports            - Raporlar (Bakiye, Ödeme Geçmişi, Bekleyen İşler)
```

### Admin Only
```
/settings/users     - Kullanıcı Yönetimi (Gelecekte eklenebilir)
```

---

## 🎨 UI/UX Tasarım Prensipleri

### Dashboard Özellikleri
- 📊 Toplam müşteri sayısı
- 📋 Bekleyen iş sayısı
- ✅ Bu ay tamamlanan iş sayısı
- 💰 Bu ay toplam gelir
- ⚠️ Bekleyen alacaklar toplamı
- 🕒 Son eklenen işler listesi

### Responsive Design
- **Desktop:** Sidebar navigation + main content area
- **Tablet:** Collapsible sidebar
- **Mobile:** Bottom navigation bar + hamburger menu
- **Touch-friendly:** Minimum 44px touch targets
- **Swipe actions:** Silme, düzenleme için swipe gestures

### Renk Şeması
- **Primary:** Mavi (#3B82F6) - Güven, profesyonellik
- **Success:** Yeşil (#10B981) - Tamamlanmış, ödeme
- **Warning:** Sarı (#F59E0B) - Bekleyen
- **Danger:** Kırmızı (#EF4444) - Borç, silme
- **Neutral:** Gri tonları - Arka plan, border

---

## 🚀 Geliştirme Fazları

### Faz 1: Temel Altyapı (1 hafta)
- [x] Next.js 14 + TypeScript kurulum
- [x] Supabase projesi oluşturma
- [x] Supabase Auth entegrasyonu
- [x] Database schema oluşturma
- [x] RLS policies tanımlama
- [x] Temel layout ve navigation
- [x] Login sayfası

### Faz 2: Müşteri Yönetimi (3-4 gün)
- [ ] Müşteri CRUD operasyonları
- [ ] Müşteri listesi sayfası
- [ ] Müşteri detay sayfası
- [ ] Müşteri arama fonksiyonu
- [ ] Form validation

### Faz 3: İş Takibi (4-5 gün)
- [ ] İş oluşturma formu
- [ ] İş listesi sayfası
- [ ] İş detay/düzenleme sayfası
- [ ] İş durumu güncelleme
- [ ] Filtreleme ve sıralama

### Faz 4: Ödeme Sistemi (3-4 gün)
- [ ] Ödeme kayıt formu
- [ ] Ödeme listesi
- [ ] Cari hesap hesaplama mantığı
- [ ] Müşteri cari durumu gösterimi

### Faz 5: Raporlama (2-3 gün)
- [ ] Dashboard istatistikleri
- [ ] Müşteri bakiye raporu
- [ ] Ödeme geçmişi raporu
- [ ] Bekleyen işler raporu
- [ ] Export fonksiyonları (PDF/Excel - opsiyonel)

### Faz 6: Güvenlik ve Test (2-3 gün)
- [ ] RLS policy testleri
- [ ] Role-based access control testleri
- [ ] Güvenlik taraması
- [ ] Mobile responsive test
- [ ] Cross-browser test
- [ ] Bug fixes

**Toplam Tahmini Süre:** 3-4 hafta (tam zamanlı)

---

## 📦 Kapsam Dışı (Gelecek Versiyonlar)

### Faz 2 Özellikleri (İsteğe Bağlı)
- E-posta bildirimleri (ödeme hatırlatma)
- SMS bildirimleri
- PDF/Excel export
- Fatura/makbuz yazdırma şablonları
- Toplu ödeme girişi
- Gelişmiş dashboard grafikleri (Chart.js)
- Müşteri portalı (müşterilerin kendi hesaplarını görmesi)
- PWA (Progressive Web App) - offline destek
- Native mobile app (React Native)
- Dosya yükleme (belge, makbuz fotoğrafı)
- Aktivite logu (audit trail)
- Otomatik yedekleme sistemi

---

## 🛠️ Geliştirme Ortamı Kurulumu

### Gerekli Araçlar
```bash
Node.js >= 18.17
npm veya yarn
Git
VS Code (önerilen IDE)
```

### Kurulum Adımları
```bash
# 1. Next.js projesi oluştur
npx create-next-app@latest on-muhasebe --typescript --tailwind --app

# 2. Gerekli paketleri yükle
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react class-variance-authority clsx tailwind-merge

# 3. shadcn/ui kurulumu
npx shadcn-ui@latest init

# 4. Environment variables
# .env.local dosyası oluştur
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Kurulumu
1. https://supabase.com hesap oluştur
2. Yeni proje oluştur
3. Database şemasını oluştur (SQL Editor)
4. RLS policies ekle
5. API keys'i kopyala

---

## 📊 Başarı Metrikleri

### Teknik Metrikler
- ✅ Sayfa yükleme süresi < 2 saniye
- ✅ API response time < 500ms
- ✅ Mobile responsive: 100% uyumluluk
- ✅ Security score: A+ (SSL Labs)
- ✅ Accessibility: WCAG 2.1 AA

### İş Metrikleri
- ✅ 100+ müşteri kapasitesi
- ✅ Eşzamanlı 5+ kullanıcı desteği
- ✅ %99.9 uptime (Vercel SLA)

---

## 🤝 İletişim ve Destek

**Geliştirme Süreci:**
- Haftalık progress update
- Demo sunumları (her faz sonunda)
- Bug tracking: GitHub Issues
- Dokümantasyon: README.md

**Post-Launch Destek:**
- 1 ay bug-fix garantisi
- Kullanıcı eğitimi
- Dokümantasyon ve kullanım kılavuzu

---

## 📝 Notlar

- Proje MVP (Minimum Viable Product) odaklı geliştirilecek
- Güvenlik en yüksek öncelik
- Mobil responsive zorunlu
- Basitlik ve kullanılabilirlik ön planda
- Ölçeklenebilir mimari (gelecek özellikler için hazır)

---

**Doküman Versiyonu:** 1.0
**Son Güncelleme:** 2025-10-06
**Durum:** Onay Bekliyor
