const API_KEY =
  "1b0437818e0cb14a189da8a65b5647e6e7d3475766dd3cc04be40e28874d3459";
const tickersHandlers = new Map();

const loadTickers = () => {
  if (tickersHandlers.size === 0) return;
  const tickersNames = [...tickersHandlers.keys()];

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickersNames}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    })
    .catch(() => console.error());
};

export const subscribeToTicker = (ticker, callback) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, callback]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;
