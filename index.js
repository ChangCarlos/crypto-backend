// index.js
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/cryptos", async (req, res) => {
  try {
    const symbols = req.query.symbols || "BTC,ETH,USDT,BNB"; // você pode passar por query ou fixar
    const response = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest", {
      params: {
        symbol: symbols,
        convert: "USD"
      },
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
      }
    });

    res.json(response.data.data);
  } catch (error) {
    console.error("Erro ao consultar CoinMarketCap:", error);
    res.status(500).json({ error: "Erro ao buscar criptomoedas" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});


app.get("/api/chart/:coinId", async (req, res) => {
  const { coinId } = req.params;

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`;

    console.log("🔍 Buscando dados para:", coinId); // 👈 Adiciona isso

    const response = await axios.get(url, {
      params: {
        vs_currency: "usd",
        days: 2,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const chartData = response.data.prices.map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: price
    }));

    res.json(chartData);
  } catch (error) {
    console.error("❌ Erro ao buscar gráfico:");
    console.error(error.response?.data || error.message || error);
    res.status(500).json({ error: "Erro ao buscar gráfico" });
  }
});

