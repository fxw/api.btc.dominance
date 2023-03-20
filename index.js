const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

app.get('/dominance', async (req, res) => {
  try {
    // Retrieve Bitcoin and Ethereum market caps
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin,ethereum',
      },
    });

    const marketCaps = {};
    response.data.forEach((coin) => {
      marketCaps[coin.id] = coin.market_cap;
    });

    // Calculate Bitcoin dominance
    const bitcoinDominance =
      (marketCaps['bitcoin'] / (marketCaps['bitcoin'] + marketCaps['ethereum'])) *
      100;

    // Check if dominance is higher than 48.4%
    if (bitcoinDominance > 48.4) {
      res.json({ dominance: bitcoinDominance });
    } else {
      res.send('Bitcoin dominance is lower than 48.4%.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving data from CoinGecko API.');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
