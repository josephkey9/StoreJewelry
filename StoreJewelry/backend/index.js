import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import NodeCache from 'node-cache';
import { fileURLToPath } from "url";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 
const CACHE_TTL = 10 * 60; 
const cache = new NodeCache({ stdTTL: CACHE_TTL });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());


function readProducts() {
  const dataPath = path.join(__dirname, 'products.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const parsed = JSON.parse(rawData);
  return Array.isArray(parsed) ? parsed : parsed.products;
}

async function fetchGoldPricePerGramUSD() {
  const cached = cache.get('goldPricePerGramUSD');
  if (cached) return cached;

  const goldApiKey = process.env.GOLDAPI_KEY;
  try {
    if (goldApiKey) {
      const resp = await axios.get('https://www.goldapi.io/api/XAU/USD', {
        headers: { 'x-access-token': goldApiKey }
      });
      const pricePerTroyOunceUSD = resp.data?.price;
      if (pricePerTroyOunceUSD && Number.isFinite(pricePerTroyOunceUSD)) {
        const GRAMS_PER_TROY_OUNCE = 31.1034768;
        const perGram = pricePerTroyOunceUSD / GRAMS_PER_TROY_OUNCE;
        cache.set('goldPricePerGramUSD', perGram);
        return perGram;
      }
    }
  } catch (err) {
    console.error("GoldAPI hata:", err.message);
  }
  
  const fallbackPerGramUSD = 75;
  cache.set('goldPricePerGramUSD', fallbackPerGramUSD);
  return fallbackPerGramUSD;
}

function priceUsd(product, goldPricePerGramUSD) {
  const score = Number(product.popularityScore) || 0;
  const basePrice = (score + 1) * Number(product.weight) * Number(goldPricePerGramUSD);
  return Math.round(basePrice * 100) / 100;
}

function popularityOutOf5(product) {
  const score = Number(product.popularityScore) || 0;
  return Math.round(score * 5 * 10) / 10;
}

app.get("/api/gold-price", async (req, res) => {
  try {
    const price = await fetchGoldPricePerGramUSD();
    const products = readProducts();

    const list = products.map(p => ({
      ...p,
      popularity: popularityOutOf5(p),
      priceUsd: priceUsd(p, price),
    }));

    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;
    let filtered = list;

    if (minPrice) filtered = filtered.filter(p => p.priceUsd >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.priceUsd <= Number(maxPrice));
    if (minPopularity) filtered = filtered.filter(p => p.popularity >= Number(minPopularity));
    if (maxPopularity) filtered = filtered.filter(p => p.popularity <= Number(maxPopularity));

    res.json({ goldPricePerGramUSD: price, products: filtered });
  } catch (err) {
    console.error("API hata:", err);
    res.status(500).json({ error: "Altın fiyatı alınamadı" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend bu portta çalışıyor: ${PORT}`);
});