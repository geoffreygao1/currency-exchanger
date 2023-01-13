import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import ExchangeRateService from './services/exchange-rate-service.js';

// Business Logic
function convertCurrency() {
  ExchangeRateService.getExchangeRate(currency)
    .then(function (currencyResponse) {
      if (currencyResponse instanceof Error) {
        const errorMessage = `There was a problem accessing the currency conversion data from  ExchangeRate-API for ${currency}: ${currencyResponse['error-type']}`;
        throw new Error(errorMessage);
      }
      printConversion(currencyResponse, currency)
    })
    .catch(function (error) {
      printError(error);
    });
}

// UI Logic