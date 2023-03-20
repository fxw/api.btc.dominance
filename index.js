
const fastify = require('fastify')({ logger: true })
const axios = require('axios');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

fastify.get('/dominance', async (request, reply) => {
  try {
    // Fetch the top 125 coins by market capitalization
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        per_page: 126,
        order: 'market_cap_desc',
      },
    });

    // Calculate the total market capitalization of all coins
    const totalMarketCap = response.data.reduce(
      (acc, coin) => acc + coin.market_cap,
      0
    );

    // Find the market capitalization of Bitcoin
    const bitcoin = response.data.find((coin) => coin.symbol === 'btc');
    const bitcoinMarketCap = bitcoin.market_cap;

    // Calculate Bitcoin dominance
    const bitcoinDominance = (bitcoinMarketCap / totalMarketCap) * 100;

    reply.send({
      bitcoin_dominance: bitcoinDominance,
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      error: 'An error occurred while fetching the data',
    });
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()