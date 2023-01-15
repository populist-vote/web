const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function getRandomBool() {
  return !!getRandomInt(2);
}

export { formatCurrency, getRandomInt, getRandomBool };
