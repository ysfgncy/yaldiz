# Ön Muhasebe Sistemi - MVP Roadmap

**Proje:** Ön Muhasebe ve İş Takip Sistemi
**Hedef:** 3-4 hafta içinde kullanılabilir MVP
**Strateji:** Lean MVP → Kullanıcı Feedback → İteratif Geliştirme

---

## 🎯 MVP Kapsamı ve Başarı Kriterleri

### MVP'ye Dahil Olanlar ✅
- ✅ Email/Password ile güvenli giriş
- ✅ Müşteri CRUD operasyonları
- ✅ İş kaydı oluşturma ve takip
- ✅ Temel ödeme kaydı ve bakiye hesaplama
- ✅ Basit dashboard (özet istatistikler)
- ✅ Mobil responsive tasarım
- ✅ Role-based access (Admin/User)

### MVP'den Sonraya Kalan Özellikler 🔜
- 🔜 Gelişmiş raporlama (Excel/PDF export)
- 🔜 Email bildirimleri
- 🔜 Vadeli ödeme takibi
- 🔜 Gelişmiş dashboard grafikleri
- 🔜 Fatura/makbuz yazdırma
- 🔜 Dosya yükleme
- 🔜 Aktivite logu

### Başarı Kriterleri
1. Kullanıcı giriş yapıp müşteri ekleyebilir
2. İş kaydı oluşturabilir ve durumunu güncelleyebilir
3. Ödeme kaydedip müşteri bakiyesini görebilir
4. Dashboard'da güncel özet bilgileri görebilir
5. Mobil cihazdan rahatlıkla kullanabilir
6. Güvenli ve stabil çalışır (>99% uptime)

---

## 📅 4 Haftalık Sprint Planı

### **Sprint 1: Foundation & Authentication** (Hafta 1 - 5 gün)

**Hedef:** Altyapı hazır, kullanıcı giriş yapabilir

#### Gün 1-2: Project Setup
- [x] Next.js 14 + TypeScript kurulumu
- [x] Tailwind CSS + shadcn/ui entegrasyonu
- [x] Supabase client/server setup
- [x] Environment variables konfigürasyonu (.env.local)
- [x] Git repository setup
- [x] Proje klasör yapısı oluşturma

**Deliverable:** ✅ Next.js projesi hazır ve çalışır durumda

#### Gün 3-4: Database & Authentication
- [x] Supabase database şeması oluşturma (users, customers, jobs, payments)
- [x] Row Level Security (RLS) policies tanımlama
- [x] Supabase Auth entegrasyonu
- [x] Auth middleware setup
- [x] Protected routes yapılandırması

**Deliverable:** ✅ Database şeması hazır, auth middleware çalışıyor

#### Gün 5: Layout & Navigation
- [x] Ana layout komponenti (sidebar, header)
- [x] Navigation menu (desktop + mobile)
- [x] Login sayfası (form + validation)
- [x] Logout fonksiyonu (UI hazır)
- [x] Route guard'ları (middleware)
- [x] Dashboard mockup (boş state)

**Deliverable:** ✅ Layout hazır, login sayfası çalışır

**Sprint 1 Demo:** ✅ TAMAMLANDI - Sisteme giriş yapma + temel navigasyon hazır

**📝 Not:** Kullanıcının Supabase'de proje oluşturması ve .env.local'i güncellemesi gerekiyor

---

### **Sprint 2: Core Features** (Hafta 2 - 5 gün)

**Hedef:** Müşteri ve iş yönetimi çalışır

#### Gün 1-2: Müşteri Yönetimi
- [x] Müşteri listesi sayfası (tablo + pagination)
- [x] Müşteri ekleme formu (validation + Zod)
- [x] Müşteri düzenleme sayfası
- [x] Müşteri silme (confirmation dialog)
- [x] Müşteri arama fonksiyonu
- [x] API routes (CRUD endpoints)

**Deliverable:** ✅ Müşteri yönetimi tamamen çalışır

#### Gün 3-4: İş Takibi
- [x] İş listesi sayfası (filtreleme: Bekliyor/Tamamlandı)
- [x] Yeni iş oluşturma formu
- [x] İş detay/düzenleme sayfası
- [x] İş durumu güncelleme (toggle)
- [x] İş silme fonksiyonu
- [x] Müşteri-İş ilişkisi (dropdown select)
- [x] API routes (iş CRUD)

**Deliverable:** ✅ İş takibi tamamen çalışır

#### Gün 5: Integration & Polish
- [x] Müşteri detay sayfasında işlerini gösterme
- [x] Form validasyonları iyileştirme
- [x] Error handling ve toast notifications
- [x] Loading states ekleme
- [x] Mobile responsive kontrol

**Deliverable:** ✅ Müşteri ve işler birbirine bağlı çalışır

**Sprint 2 Demo:** ✅ TAMAMLANDI - Müşteri ekleme → İş oluşturma → İş tamamlama akışı

---

### **Sprint 3: Payments & Dashboard** (Hafta 3 - 4 gün)

**Hedef:** Ödeme sistemi ve dashboard çalışır

#### Gün 1-2: Ödeme Sistemi
- [x] Ödeme kayıt formu (müşteri seç, tutar, tip, tarih)
- [x] Ödeme listesi sayfası (müşteri bazında)
- [x] Cari hesap hesaplama mantığı (total_jobs - total_payments)
- [x] Müşteri detayında bakiye gösterimi
- [x] Ödeme geçmişi tablosu
- [x] API routes (ödeme CRUD + hesaplama)

> Not: Ödeme CRUD ve özet hesaplamaları artık Next.js API routes üzerinden sunuluyor; client tarafı fetch ile bu endpointleri kullanıyor.

**Deliverable:** Ödeme kaydı ve bakiye hesaplama çalışır

**Güncel Durum:** Formlar ve Next.js API routes stabil; dashboard metrikleri devrede, responsive/UX iyileştirmeleri sıradaki iş.

#### Gün 3: Dashboard
- [x] Dashboard layout
- [x] Toplam müşteri sayısı kartı
- [x] Bekleyen iş sayısı kartı
- [x] Bu ay tamamlanan iş sayısı
- [x] Bu ay toplam gelir
- [x] Bekleyen alacaklar toplamı
- [x] Son eklenen işler listesi (5 adet)

**Deliverable:** Dashboard özet bilgileri gösterir

**Güncel Durum:** Metrik kartları Supabase verisiyle canlı; alacak listesi ve son işler gerçek zamanlı güncelleniyor. Touch-friendly butonlar, skeleton'lar ve hata durumları tamam; tablet QA ve canlı yayın checklist'i uygulanıyor.

#### Gün 4: Responsive & UX
- [x] Tüm sayfaları mobile responsive yapma
- [x] Touch-friendly butonlar (min 44px)
- [x] Tablet view kontrolleri
- [x] Loading skeletons ekleme
- [x] Empty states iyileştirme
- [x] Error boundaries

**Deliverable:** Sistem mobilde kusursuz çalışır

**Sprint 3 Demo:** Ödeme kaydı → Bakiye güncelleme → Dashboard özeti

---

### **Sprint 4: Testing & Deployment** (Hafta 4 - 3 gün)

**Hedef:** Sistem canlıya alınır

#### Gün 1-2: Testing & Bug Fixes
- [ ] Critical path manuel testleri
  - [ ] Login → Müşteri ekle → İş oluştur → Ödeme kaydet → Dashboard kontrol
- [ ] Role-based access testleri (Admin vs User)
- [ ] Mobile cihaz testleri (iOS + Android)
- [ ] Cross-browser testleri (Chrome, Safari, Firefox)
- [ ] RLS policy testleri (kullanıcı kendi verisini görüyor mu?)
- [ ] Bug fixing (kritik hatalar)
- [ ] Performance optimization (sayfa yükleme hızı)

**Deliverable:** Kritik hatalar giderildi, sistem stabil

**Güncel Durum:** Build smoke testi Node 20.11.1 ile başarılı; manuel kritik-akış testlerine başlanacak.

#### Gün 3: Deployment & Documentation
- [ ] Vercel deployment konfigürasyonu
- [ ] Production environment variables
- [ ] Supabase production database setup
- [ ] SSL/HTTPS konfigürasyonu
- [ ] Domain bağlama (opsiyonel)
- [ ] README.md güncelleme
- [ ] Kullanıcı dokümantasyonu (basit kullanım kılavuzu)
- [ ] Backup stratejisi planlama

**Deliverable:** Sistem canlıda çalışıyor

**Sprint 4 Demo:** Production ortamında tam akış testi

---

## 🚀 Post-MVP Geliştirme Fazları

### **Faz 1: Raporlama ve İyileştirmeler** (Sprint 5-6, 2 hafta)
- [ ] Müşteri bazında detaylı bakiye raporu
- [ ] Ödeme geçmişi raporu (tarih filtreleme)
- [ ] Bekleyen işler raporu
- [ ] Excel export fonksiyonu
- [ ] PDF export (opsiyonel)
- [ ] Gelişmiş filtreleme ve sıralama
- [ ] Arama fonksiyonlarını iyileştirme

**Değer:** Kullanıcı daha detaylı analiz yapabilir

### **Faz 2: Otomasyon ve Bildirimler** (Sprint 7-8, 2 hafta)
- [ ] Email bildirim sistemi kurulumu
- [ ] Ödeme hatırlatma emaili (vadesi geçen)
- [ ] Haftalık özet raporu emaili
- [ ] Vadeli ödeme desteği (vade tarihi + takip)
- [ ] Gelişmiş dashboard grafikleri (Chart.js)
- [ ] Aylık/yıllık karşılaştırmalar

**Değer:** Sistem proaktif hale gelir

### **Faz 3: Genişleme ve Entegrasyon** (Sprint 9+)
- [ ] Fatura/makbuz yazdırma şablonları
- [ ] Dosya yükleme (belge, makbuz fotoğrafı)
- [ ] Aktivite logu (audit trail)
- [ ] Otomatik yedekleme sistemi
- [ ] Kullanıcı yönetimi (multi-user ekleme)
- [ ] Müşteri portalı (müşterilerin kendi hesaplarını görmesi)
- [ ] PWA (Progressive Web App) - offline destek

**Değer:** Sistem enterprise-grade hale gelir

---

## 📊 İlerleme Takibi

### Haftalık Milestone'lar
- **Hafta 1 Sonu:** ✅ **TAMAMLANDI** - Giriş yapabiliyorum (Sprint 1 bitti)
- **Hafta 2 Sonu:** ✅ **TAMAMLANDI** - Müşteri ve iş yönetimi çalışıyor (Sprint 2 bitti)
- **Hafta 3 Sonu:** ⏳ Devam ediyor - Ödeme & dashboard modülleri tamam; responsive son kontroller ve yayın hazırlığı devam ediyor
- **Hafta 4 Sonu:** ⏳ Bekliyor - Sistem canlıda

### Risk Yönetimi
| Risk | Olasılık | Etki | Aksiyon |
|------|----------|------|---------|
| Supabase kurulum sorunları | Orta | Yüksek | İlk gün test et, dokümantasyon hazır |
| RLS policy hatası | Yüksek | Kritik | Sprint 1'de detaylı test, örnekler hazırla |
| Mobile responsive gecikmesi | Orta | Orta | Her sprint'te responsive kontrol |
| Deployment sorunları | Düşük | Yüksek | Erken Vercel test deployment |

### Başarı Metrikleri
- **Teknik:**
  - Sayfa yükleme < 2 saniye
  - Mobile responsive 100% uyumlu
  - RLS policies çalışıyor
  - Sıfır kritik güvenlik açığı

- **İş:**
  - Kullanıcı temel akışları tamamlayabiliyor
  - Gerçek müşteri verisi ile test edilmiş
  - Stakeholder onayı alınmış

---

## 🛠️ Teknik Stack (Özet)

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod

### Backend
- Next.js API Routes
- Supabase PostgreSQL
- Supabase Auth + RLS

### Deployment
- Vercel (Frontend + API)
- Supabase Cloud (Database)

---

## 📝 Notlar

### MVP Felsefesi
- **Build → Measure → Learn:** Hızlı piyasaya çık, kullanıcı feedbacki al, iyileştir
- **Scope Control:** Sadece kritik özellikler, her şeyi sonra ekleyebiliriz
- **Quality Focus:** Az ama kusursuz çalışan özellikler

### Sprint Disiplini
- **Daily Commits:** Her gün en az 1 commit
- **Sprint Demo:** Her sprint sonunda çalışan demo
- **Stakeholder Update:** Haftalık ilerleme raporu
- **Retrospective:** Her sprint sonunda ne iyi gitti, ne iyileştirilebilir?

### Teknik Borç Yönetimi
- Her sprint'te %20 zaman teknik borç temizliğine
- Code review standartları (kendi kodunu review et)
- Dokümantasyon güncelle (README, inline comments)

---

**Doküman Versiyonu:** 1.4
**Hazırlayan:** Claude Code
**Tarih:** 2025-10-06
**Durum:** Ready for Implementation 🚀
