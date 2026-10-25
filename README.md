# Dolabımda Ne Var AI (Digital Wardrobe & AI Stylist)

Yapay zekâ destekli kişisel gardırop, akıllı kıyafet analizi ve stil kombin asistanı.

---

## 🌟 Temel Özellikler

- **Canlı Kamera & Fotoğraf ile Kıyafet Ekleme:**
  - Cihazınızın kamerasını doğrudan uygulama içinden açarak kıyafetlerinizin fotoğrafını çekebilir veya galerinizden yükleyebilirsiniz.
  - Ön ve arka kamera arasında geçiş yapabilme.
  - Yapay zekâ ile kumaş dokusu, ana renk, mevsim ve kıyafet türünü otomatik tanıma.

- **AI Günün Kombini Motoru:**
  - Şehir ve hava durumu (İstanbul, Ankara, İzmir, Bodrum, Londra, Paris), ortam (Ofis, Hafta Sonu Kahvesi, Akşam Yemeği vb.) ve stil yönü (Old Money, Minimalist, Smart Casual) bazlı akıllı kombinler.
  - Dolaptaki gerçek parçaları uyumlu renk ve kumaş katmanlarıyla eşleştirme.
  - Kombin uyum skoru (%90+), renk dengesi ve stilist taşıma tavsiyeleri.

- **Kıyafet & Renk Analizi Laboratuvarı:**
  - Herhangi bir kıyafeti kamera veya galeriden taratarak uyumlu renk paleti, 3 farklı ortam kombin formülü ve kumaş bakım tüyoları alma.

- **Kapsül Gardırop & Verimlilik Raporu:**
  - Gardıroptaki eksik 3 kilit parçayı tespit etme, giyme başına maliyet analizi.

- **Kombin Takvimi & E-posta Paylaşımı:**
  - Haftalık stil planlayıcı ve günün kombinini e-posta adresinize tek tıkla gönderme.

---

## 🚀 GitHub'a Yükleme (Adım Adım)

1. Bilgisayarınızda terminali açın ve proje dizinine gelin:
   ```bash
   git init
   git add .
   git commit -m "feat: Dolabımda Ne Var AI - Kamera destekli gardırop ve stil asistanı"
   ```

2. GitHub'da yeni bir repository oluşturun (Örn: `dolabimda-ne-var-ai`).

3. GitHub reponuzu bağlayıp push yapın:
   ```bash
   git remote add origin https://github.com/<KULLANICI_ADINIZ>/dolabimda-ne-var-ai.git
   git branch -M main
   git push -u origin main
   ```

---

## ⚡ Vercel'de Yayınlama & API Key Tanımlama

Bu proje Vercel için tam uyumlu olarak yapılandırılmıştır (`vercel.json` ve `api/index.ts` hazırdır).

### 1. Vercel'e İçe Aktarma
1. [Vercel Dashboard](https://vercel.com/dashboard) adresine gidin.
2. **"Add New..."** > **"Project"** butonuna tıklayın.
3. GitHub reponuzu (`dolabimda-ne-var-ai`) seçin ve **"Import"** deyin.

### 2. API Key Eklenmesi (Önemli!)
Vercel projenizi Deploy etmeden önce veya ettikten sonra:
1. **Settings** sekmesine gelin.
2. Sol menüden **Environment Variables** bölümüne tıklayın.
3. Aşağıdaki değişkeni ekleyin:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSy...` *(Google AI Studio'dan aldığınız API anahtarı)*
   - **Environment:** `Production`, `Preview`, `Development` (tüm kutucukları işaretleyin)
4. **Save** butonuna tıklayın.
5. Değişkeni ekledikten sonra **Deployments** sekmesine gelip **Redeploy** yapın.

> **API Anahtarını Nereden Alabilirsiniz?**
> [Google AI Studio](https://aistudio.google.com/app/apikey) adresinden ücretsiz olarak Gemini API anahtarınızı oluşturabilirsiniz.

---

## 💻 Localde Çalıştırma

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. `.env.example` dosyasını `.env` olarak kopyalayın ve Gemini API anahtarınızı girin:
   ```bash
   cp .env.example .env
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

4. Tarayıcınızda `http://localhost:3000` adresini açın.

---

## 📦 Kullanılan Teknolojiler

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Express, Node.js, Vercel Serverless Functions
- **Yapay Zekâ:** Google GenAI SDK (`@google/genai` - `gemini-3.8-flash`)
- **Kamera Erişimi:** HTML5 MediaDevices API (`navigator.mediaDevices.getUserMedia`)
