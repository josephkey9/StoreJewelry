# Store Jewelry
<img width="1891" height="880" alt="Ekran görüntüsü 2025-10-04 162050" src="https://github.com/user-attachments/assets/fdc022b2-d832-457d-9fae-9b6af236b864" />


🔐 **Backend (Node.js + Express)**  
- Altın fiyatını GoldAPI üzerinden çeker  
- Sonuçları cache (NodeCache) ile optimize eder  
- API endpointleri üzerinden frontend’e veri aktarır  
- Fiyatları ürün ağırlığı + popülerlik skoruna göre hesaplar  

🎨 **Frontend (React + Vite)**  
- Dinamik ürün listesi  
- Fiyat & popülerlik filtreleme  
- Responsive modern arayüz  

---

### ⚡ Kurulum

```bash
# 1) BACKEND
cd backend
npm install
npm run dev

# 2) .env dosyası oluşturun
GOLDAPI_KEY=senin-api-key

# 3) FRONTEND
cd frontend
cd vite-project
npm install
npm run dev
