export default class ExchangeRateService {
  static async getExchangeRate(currency) {
    return fetch(`https://v6.exchangerate-api.com/v6/${API - KEY}/latest/${currency}`)
      .then(function (response) {
        if (!response.ok) {
          const errorMessage = `${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .catch(function (error) {
        return error;
      });
  }
}