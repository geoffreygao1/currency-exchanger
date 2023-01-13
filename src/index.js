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
      sessionStorage.setItem("conversionRates", JSON.stringify(currencyResponse["conversion_rates"]));
      printConversion(currencyResponse, value);
    })
    .catch(function (error) {
      printError(error);
    });
}

function calculateConversion(exchangeRate, value) {
  return (value * exchangeRate).toFixed(2);
}

function updateConversion(newCurrencyType, value) {
  let conversionRates = JSON.parse(sessionStorage.getItem("conversionRates"));
  return (value * conversionRates[newCurrencyType]).toFixed(2);
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

function updateFlags() {
  const currencyToCountryCode = {
    "USD": "https://cdn-icons-png.flaticon.com/512/197/197484.png",
    "EUR": "https://cdn-icons-png.flaticon.com/512/197/197615.png",
    "JPY": "https://cdn-icons-png.flaticon.com/512/197/197604.png",
    "AUD": "https://cdn-icons-png.flaticon.com/512/197/197507.png",
    "CAD": "https://cdn-icons-png.flaticon.com/512/197/197430.png",
    "GBP": "https://cdn-icons-png.flaticon.com/512/197/197374.png"
  };

  document.getElementById("inputFlag").innerHTML = null;
  document.getElementById("outputFlag").innerHTML = null;
  const inputCurrencyType = document.getElementById("inputCurrencyType").value;
  const outputCurrencyType = document.getElementById("outputCurrencyType").value;
  let inputFlag = document.createElement("img");
  inputFlag.setAttribute("src", `${currencyToCountryCode[inputCurrencyType]}`);
  let outputFlag = document.createElement("img");
  outputFlag.setAttribute("src", `${currencyToCountryCode[outputCurrencyType]}`);
  document.getElementById("inputFlag").append(inputFlag);
  document.getElementById("outputFlag").append(outputFlag);
}

function handleInputSubmission() {
  clearError();
  updateFlags();
  const inputValue = document.getElementById("inputValue").value;
  const inputCurrencyType = document.getElementById("inputCurrencyType").value;
  convertCurrency(inputCurrencyType, inputValue);
}

function handleOutputSubmission() {
  clearError();
  updateFlags();

  const inputValue = document.getElementById("inputValue").value;
  const outputCurrencyType = document.getElementById("outputCurrencyType").value;
  let outputValue = document.getElementById("outputValue");
  outputValue.value = updateConversion(outputCurrencyType, inputValue);
}

window.addEventListener("load", function () {
  document.querySelector('form#inputCurrencyForm').addEventListener("change", handleInputSubmission);
  document.querySelector('form#outputCurrencyForm').addEventListener("change", handleOutputSubmission);
  updateFlags();
});