# Brutten Nete - Türk Maaş Hesaplama Uygulaması

Bu, Create React App ile oluşturulmuş bir Türk maaş hesaplama uygulamasıdır. Uygulama, 2025 ve gelecek yıllar için doğru vergi hesaplamaları, çoklu yıl planlaması ve Excel export özellikleri sunar.

🌐 **Canlı Site**: [https://eneskasim18.github.io/brutten-nete](https://eneskasim18.github.io/brutten-nete)

## 🚀 Özellikler

- ✅ **Doğru Türk Vergi Hesaplamaları** (2025 oranları)
- 📊 **Excel Export** (Türkçe formatlar ile)
- 📅 **Çoklu Yıl Planlaması** (2026, 2027...)
- 💰 **Enflasyon Hesaplayıcısı**
- ⚙️ **Özel Vergi Oranları Düzenleme**
- 📱 **Responsive Tasarım**

## 📂 Proje Yapısı

```
src/
  ├── screens/        # Ana ekran bileşenleri
  ├── components/     # Tekrar kullanılabilir bileşenler
  ├── services/       # API ve diğer servisler
  ├── utils/          # Yardımcı fonksiyonlar ve sabitler
  ├── assets/         # Resimler, fontlar vb.
  └── styles/         # Global stiller
```

## 🔧 Mevcut Komutlar

Proje dizininde çalıştırabileceğiniz komutlar:

### `npm start`

Uygulamayı geliştirme modunda çalıştırır.\
[http://localhost:3000](http://localhost:3000) adresinde görüntüleyebilirsiniz.

### `npm test`

Test çalıştırıcısını interaktif izleme modunda başlatır.

### `npm run build`

Uygulamayı production için `build` klasörüne derler.

## 🚀 Deployment Workflow

Bu proje **GitHub Actions** kullanarak otomatik deploy sistemi ile çalışır.

### 📋 Otomatik Deploy Süreci

#### 1. **Tetikleyici (Trigger)**
- ✅ Main branch'e **doğrudan push** 
- ✅ **Pull Request** merge edildiğinde
- ✅ **Feature branch** → main merge'ünde

#### 2. **GitHub Actions Adımları**
```
1. 📥 Kodu indir (Checkout)
2. ⚙️ Node.js kur (v18)
3. 📦 npm install (Dependencies)  
4. 🔨 npm run build (React build)
5. 🌐 GitHub Pages'e deploy et
```

#### 3. **Deploy Süresi**: 2-3 dakika

### 🔄 Development Workflow

```bash
# 1. Yeni feature branch oluştur
git checkout -b feature/yeni-ozellik

# 2. Değişikliklerini yap ve commit et
git add .
git commit -m "Yeni özellik eklendi"
git push origin feature/yeni-ozellik

# 3. GitHub'da Pull Request oluştur ve merge et
# ↓ Otomatik deploy başlar!

# 4. 2-3 dakika içinde site güncellenir
# https://eneskasim18.github.io/brutten-nete
```

### 📊 Deploy Durumu Takibi

GitHub'da repository → **"Actions"** sekmesi:
- ✅ **Yeşil**: Başarılı deploy
- ❌ **Kırmızı**: Hatalı deploy  
- 🟡 **Sarı**: Devam eden deploy

## 🛠️ Başlangıç

1. **Repository'yi klonlayın**
   ```bash
   git clone https://github.com/eneskasim18/brutten-nete.git
   cd brutten-nete
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın**
   ```bash
   npm start
   ```

## 💡 Kullanım

1. **Brüt maaş** girin
2. **Yıl seçin** (2025, 2026, 2027...)
3. **Gelecek yıllar** için enflasyon oranı ekleyin
4. **Hesapla** butonuna tıklayın
5. **Excel Export** ile detaylı rapor alın

## 🔧 Teknik Detaylar

- **Framework**: React 18
- **Styling**: CSS Modules
- **Build Tool**: Create React App
- **Deploy**: GitHub Pages + GitHub Actions
- **Excel Export**: XLSX library
- **Türkçe Formatlar**: Özel number formatting

## 📈 Vergi Hesaplamaları

- **SGK Primi**: %14 (işçi payı)
- **İşsizlik Sigortası**: %1
- **Damga Vergisi**: %0.759 (muafiyet dahil)
- **Gelir Vergisi**: Dilimli yapı (2025 oranları)
- **AGI**: Asgari Geçim İndirimi

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

**Otomatik deploy sayesinde merge sonrası değişiklikler anında yayına alınır!** 🚀 