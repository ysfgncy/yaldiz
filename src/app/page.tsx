import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const services = [
  {
    title: 'Kutu ve Ambalaj Tasarımı',
    description:
      'Özel kesim kutulardan lüks ambalaj kaplamalarına kadar altın yaldızlı çözümlerle markanızı vitrinde öne çıkarın.',
  },
  {
    title: 'Davetiye ve Kart Baskıları',
    description:
      'Premium davetiye, sertifika ve kartvizit baskılarında sıcak yaldız ile ışıltılı ilk izlenimler oluşturun.',
  },
  {
    title: 'Kitap ve Kırtasiye Detayları',
    description:
      'Cilt sırtı, defter ve ajanda üretimlerinde dayanıklı ve göz alıcı gold foil uygulamaları.',
  },
  {
    title: 'Lüks Kağıt Ürünleri',
    description:
      'Hediye kartı, menü ve sertifika gibi özel kağıt ürünlerinde katmanlı yaldız baskı uzmanlığı.',
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Tasarım ve Hazırlık',
    description:
      'Müşteri brief’ini alıp baskı için en doğru folyo, gramaj ve renk kombinasyonunu öneriyoruz.',
  },
  {
    number: '02',
    title: 'Prova ve Onay',
    description:
      'Numune baskılar ile altın yaldızın yüzeydeki yansımasını birlikte kontrol ediyoruz.',
  },
  {
    number: '03',
    title: 'Üretim ve Kalite',
    description:
      'Tam otomatik sıcak yaldız makinelerinde hassas basınç, sıcaklık ve hizalama ile üretim yapıyoruz.',
  },
  {
    number: '04',
    title: 'Teslimat ve Destek',
    description:
      'Türkiye geneline hızlı teslimat; kapak, kesim ve diğer bitiş işlemlerinde destek sağlıyoruz.',
  },
]

const highlights = [
  {
    stat: '15+ yıl',
    label: 'Sıcak yaldız baskı deneyimi',
  },
  {
    stat: '48 saat',
    label: 'Hızlı numune hazırlığı',
  },
  {
    stat: '%99',
    label: 'Müşteri memnuniyeti',
  },
  {
    stat: '7/24',
    label: 'Mobil iş takip desteği',
  },
]

export const metadata: Metadata = {
  title: 'Azra Yaldız | Sıcak Yaldız ve Gold Foil Baskı Çözümleri',
  description:
    'Azra Yaldız ile kutu, davetiye ve lüks kağıt ürünlerinde sıcak yaldız baskı çözümleri. Altın folyo ile markanızı öne çıkarırken, mobil ön muhasebe paneliyle iş takibini kolaylaştırın.',
}

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-neutral-50">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-[-20%] left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-200/40 via-amber-100/30 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[360px] w-[360px] rounded-full bg-gradient-to-br from-amber-300/30 via-amber-200/20 to-transparent blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-amber-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link
            href="#hero"
            className="flex items-center gap-3 text-lg font-semibold tracking-tight text-amber-700"
          >
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-amber-200 bg-amber-50 shadow-inner">
              <Image src="/logo.png" alt="Azra Yaldız" width={32} height={32} className="h-8 w-8 object-contain" />
            </span>
            <span>Azra Yaldız</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 md:flex">
            <a className="hover:text-amber-700" href="#services">
              Hizmetler
            </a>
            <a className="hover:text-amber-700" href="#process">
              Sürecimiz
            </a>
            <a className="hover:text-amber-700" href="#about">
              Neden Biz
            </a>
            <a className="hover:text-amber-700" href="#contact">
              İletişim
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-semibold text-amber-700 hover:text-amber-800"
              >
                Giriş Yap
              </Button>
            </Link>
            <Link href="#contact">
              <Button className="bg-amber-600 text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700">
                Ücretsiz Danışmanlık
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main id="hero" className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-16 md:py-24 scroll-mt-24">
        <section className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:items-center scroll-mt-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Premium sıcak yaldız baskı
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              Yaldız ve Gold Foil Baskı ile Ambalajlarınıza Altın Dokunuş Katın
            </h1>
            <p className="text-lg leading-relaxed text-neutral-600">
              Lüks kutu, davetiye, kitap ve kırtasiye baskılarında sıcak yaldız ustalığımızla markanızın algısını yükseltin. Mobil ön muhasebe panelimiz sayesinde işlerinizi, müşterilerinizi ve ödemelerinizi aynı yerden yönetin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#services">
                <Button size="lg" className="bg-amber-600 text-white shadow-lg shadow-amber-600/30 hover:bg-amber-700">
                  Hizmetlerimizi İncele
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                  Ön Muhasebe Paneline Giriş
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-white via-amber-50 to-white p-8 shadow-xl shadow-amber-200/30">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900">Sıcak Yaldız Ustalığı</h2>
                <p className="text-sm leading-relaxed text-neutral-600">
                  Folyo rulodan gelen altın varak, özel kalıplarla yüksek ısı ve basınç yardımıyla kağıt yüzeyine işlenir. Böylece pürüzsüz, parlak ve uzun ömürlü bir görünüm elde edilir. Üretim tesisimizde her baskı aşaması dijital olarak takip edilir.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <Card key={item.label} className="border-amber-100 bg-white/80">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-2xl font-bold text-amber-700">{item.stat}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-neutral-600">{item.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br from-amber-200/60 to-transparent blur-2xl" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="services" className="space-y-8 scroll-mt-24">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Sunduğumuz Yaldızlı Hizmetler</h2>
            <p className="mx-auto max-w-2xl text-base text-neutral-600">
              Altın, gümüş, bakır ve holografik folyo seçenekleriyle ambalajlarınızda kalıcı bir premium algı oluşturuyoruz. Tasarım, baskı ve sevkiyat sürecini uçtan uca yönetiyoruz.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <Card key={service.title} className="border-amber-100 bg-white/80 shadow-sm shadow-amber-100/40 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-neutral-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-neutral-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="process" className="space-y-10 scroll-mt-24">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Sıcak Yaldız Baskıda İş Akışımız</h2>
            <p className="mx-auto max-w-3xl text-base text-neutral-600">
              Her proje için ölçü, gramaj, folyo seçimi ve baskı parametrelerini belirleyip yüksek kalite standartlarını sağlıyoruz. Süreç boyunca şeffaf raporlama ile yanınızdayız.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {processSteps.map((step) => (
              <div key={step.number} className="rounded-2xl border border-amber-100 bg-white/70 p-6 shadow-sm">
                <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">{step.number}</span>
                <h3 className="mt-3 text-xl font-semibold text-neutral-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="grid gap-12 rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-inner shadow-amber-100/40 md:grid-cols-2 scroll-mt-24">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-neutral-900">Neden Azra Yaldız?</h2>
            <p className="text-base leading-relaxed text-neutral-600">
              Geleneksel zanaatkarlığı modern teknolojilerle buluşturarak kusursuz sıcak yaldız baskılar üretiyoruz. Kutu, çanta, davetiye, kitap kapağı ve kurumsal kırtasiye gibi lüks temasın önemli olduğu her alanda çözüm ortağınızız.
            </p>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" aria-hidden="true" />
                Kalıp ve folyo stok takibini dijital olarak yaparak hızlı üretim planlıyoruz.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" aria-hidden="true" />
                Mobil ön muhasebe panelimiz ile her ekip üyesi iş ilerlemesini gerçek zamanlı izleyebiliyor.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" aria-hidden="true" />
                Sürdürülebilirlik için FSC sertifikalı kağıt ve düşük enerji tüketimli baskı parkuru.
              </li>
            </ul>
          </div>
          <div className="grid gap-4">
            <Card className="border-amber-100 bg-gradient-to-br from-white via-amber-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-neutral-900">Öne Çıkan Kullanım Alanları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-neutral-600">
                <ul className="space-y-1">
                  {[
                    'Kozmetik ve parfüm kutuları',
                    'Gıda ve çikolata premium ambalajları',
                    'Düğün davetiye ve nişan setleri',
                    'Kurumsal hediye ve ajanda baskıları',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="contact" className="grid gap-8 rounded-3xl border border-amber-100 bg-white/90 p-8 shadow-lg shadow-amber-100/60 md:grid-cols-[1.1fr_minmax(0,1fr)] scroll-mt-24">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-neutral-900">Projelerinizi Konuşalım</h2>
            <p className="text-base leading-relaxed text-neutral-600">
              Özel ambalaj ihtiyaçlarınızı, baskı adetlerinizi ve teslim terminlerinizi paylaşın; ekibimiz 24 saat içinde size özel teklif hazırlasın.
            </p>
            <div className="space-y-3 text-sm text-neutral-600">
              <p className="font-semibold text-neutral-900">İletişim Kanalları</p>
              <p>Telefon: <a className="text-amber-700 hover:underline" href="tel:+902123456789">+90 212 345 67 89</a></p>
              <p>E-posta: <a className="text-amber-700 hover:underline" href="mailto:info@altinizbaski.com">info@altinizbaski.com</a></p>
              <p>Adres: İkitelli OSB, Matbaacılar Sitesi, İstanbul</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/login">
                <Button className="bg-amber-600 text-white shadow-lg shadow-amber-600/30 hover:bg-amber-700">
                  Ön Muhasebe Paneline Giriş
                </Button>
              </Link>
              <Link href="mailto:info@altinizbaski.com">
                <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                  Numune Talep Et
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-6">
            <h3 className="text-lg font-semibold text-neutral-900">Hızlı Teklif Formu</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Projenizi birkaç cümleyle paylaşın, sizi en kısa sürede arayalım.
            </p>
            <form className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="name">
                  Ad Soyad
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Adınız"
                  className={cn(
                    'w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-inner shadow-amber-100 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200'
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="email">
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="ornek@firma.com"
                  className={cn(
                    'w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-inner shadow-amber-100 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200'
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="details">
                  Proje Detayları
                </label>
                <textarea
                  id="details"
                  rows={4}
                  placeholder="Ürün türü, adet, teslim tarihi gibi bilgileri ekleyin"
                  className={cn(
                    'w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-inner shadow-amber-100 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200'
                  )}
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 text-white shadow-md shadow-amber-600/30 hover:bg-amber-700">
                Teklif Talebi Gönder
              </Button>
              <p className="text-xs text-neutral-500">
                Form talepleri otomatik olarak ekibimize iletilir. Kişisel verileriniz KVKK kapsamında korunur.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-amber-100 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Azra Yaldız. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-4">
            <a className="hover:text-amber-700" href="#services">
              Hizmetler
            </a>
            <a className="hover:text-amber-700" href="#process">
              Süreç
            </a>
            <a className="hover:text-amber-700" href="#about">
              Neden Biz
            </a>
            <a className="hover:text-amber-700" href="#contact">
              İletişim
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
