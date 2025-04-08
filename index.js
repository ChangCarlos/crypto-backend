import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Market Trend (apenas 4 criptos principais)
app.get("/api/market-trend", async (req, res) => {
  const ids = "bitcoin,ethereum,tether,binancecoin";

  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        ids,
        order: "market_cap_desc"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erro Market Trend:", error.message);
    res.status(500).json({ error: "Erro ao buscar dados do Market Trend" });
  }
});

// Market Update (várias criptos)
app.get("/api/market-update", async (req, res) => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 50,
        page: 1
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erro Market Update:", error.message);
    res.status(500).json({ error: "Erro ao buscar dados do Market Update" });
  }
});

// Chart (gráfico de cada cripto)
app.get("/api/chart/:coinId", async (req, res) => {
  const { coinId } = req.params;

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`;

    const response = await axios.get(url, {
      params: {
        vs_currency: "usd",
        days: 7,
        interval: "daily"
      }
    });

    const chartData = response.data.prices.map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: price
    }));

    res.json(chartData);
  } catch (error) {
    console.error("Erro no gráfico:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao buscar gráfico" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
