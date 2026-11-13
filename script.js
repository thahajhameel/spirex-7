
const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convert");
const swapBtn = document.getElementById("swap");
const result = document.getElementById("result");
const rateText = document.getElementById("rate");

async function convertCurrency() {
    const value = Number(amount.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (!Number.isFinite(value) || value <= 0) {
        result.textContent = "Enter a valid amount";
        rateText.textContent = "";
        return;
    }

    result.textContent = "Converting...";
    rateText.textContent = "";

    try {
        const response = await fetch(
            `https://open.er-api.com/v6/latest/${from}`
        );

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        if (data.result !== "success") {
            throw new Error("Exchange rate unavailable");
        }

        const exchangeRate = data.rates[to];
        const convertedAmount = value * exchangeRate;

        result.textContent =
            `${convertedAmount.toLocaleString(undefined, {
                maximumFractionDigits: 2
            })} ${to}`;

        rateText.textContent =
            `1 ${from} = ${exchangeRate} ${to}`;

    } catch (error) {
        result.textContent = "Unable to convert currency";
        rateText.textContent = "Please check your internet connection.";
    }
}

convertBtn.addEventListener("click", convertCurrency);

swapBtn.addEventListener("click", () => {
    const temp = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    convertCurrency();
});

amount.addEventListener("input", convertCurrency);
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

convertCurrency();
