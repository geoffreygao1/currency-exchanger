import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import ExchangeRateService from './services/exchange-rate-service.js';

// Business Logic
function convertCurrency(currency, value) {
  ExchangeRateService.getExchangeRate(currency)
    .then(function (currencyResponse) {
      if (currencyResponse instanceof Error) {
        const errorMessage = `There was a problem accessing the currency conversion data from  ExchangeRate-API for ${currency}: ${currencyResponse['error-type']}`;
        throw new Error(errorMessage);
      }
      printConversion(currencyResponse, value);
    })
    .catch(function (error) {
      printError(error);
    });
}

function calculateConversion(exchangeRate, value) {
  return (value * exchangeRate).toFixed(2);
}

// UI Logic
function printConversion(currencyResponse, value) {
  const outputCurrencyType = document.getElementById("outputCurrencyType").value;
  let outputValue = document.getElementById("outputValue");
  let conversionRates = currencyResponse['conversion_rates'];
  outputValue.value = calculateConversion(conversionRates[outputCurrencyType], value);
}

function printError(error) {
  document.getElementById('error').innerText = error;
}

function clearError() {
  document.getElementById('error').innerText = null;
}

function handleFormSubmission() {
  clearError();
  const inputValue = document.getElementById("inputValue").value;
  const inputCurrencyType = document.getElementById("inputCurrencyType").value;
  convertCurrency(inputCurrencyType, inputValue);
}

window.addEventListener("load", function () {
  document.querySelector('form').addEventListener("change", handleFormSubmission);
});