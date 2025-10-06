# Production Release Checklist (2025-10-06)

## Manuel Test Senaryosu
1. `Login` → geçerli kullanıcı bilgileriyle giriş yap; başarısız girişte hata tostunu doğrula.
2. `Müşteri Oluşturma` → yeni müşteri ekle, liste ve arama alanında göründüğünü kontrol et.
3. `İş Akışı` → oluşturulan müşteri için yeni iş aç, durum değişimini (bekliyor ↔ tamamlandı) doğrula.
4. `Ödeme Kaydı` → aynı müşteri için ödeme ekle, dashboard ve müşteri detayındaki bakiye güncellemesini izle.
5. `Dashboard` → toplam müşteriler, bekleyen işler, aylık gelir ve bekleyen alacaklar kartlarının güncel değerler gösterdiğini doğrula.
6. `Mobil/Tablet Kontrolü` → iPad Mini ve iPhone 13 kırılımlarında müşteriler/işler/ödemeler sayfalarını gözden geçir; tablo taşmalarını ve buton erişilebilirliğini kontrol et.

## Teknik Kontroller
- [ ] Supabase prod veritabanı anahtarlarının `.env.production` dosyasında güncel olduğundan emin ol.
- [x] Build ortamındaki Node.js sürümünün `^18.18.0` veya üstü olduğundan emin ol. _(Yerelde `nvm use 20.11.1` ile doğrulandı.)_
- [ ] Vercel projesinde çevresel değişkenleri güncelle ve koru.
- [x] `npm run lint` ve temel sayfalarda hızlı smoke test (Next.js `next build`) çalıştır. _(Lint ✅; `next build` Node 20.11.1 ile başarıyla tamamlandı.)_
- [ ] Production Supabase RLS politikalarının test kullanıcısıyla doğrulandığını not et.

## İzleme ve Geri Bildirim
- [ ] Canlı sistemde ilk 24 saat Cloudwatch/Vercel loglarını izle.
- [ ] Kullanıcı geri bildirim formu/kanalı için duyuru paylaş.
- [ ] Sprint 4 başlangıcında responsive tablet kontrollerini roadmap üzerinden tamamlandı olarak işaretle.
