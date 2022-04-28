const config = importModule('hnt-earnings/config');

const HELIUM_API_BASE_URL = 'https://api.helium.io';

module.exports.getEarnings = async function (rate, name, period) {
  const address = await getAddress(name);

  const d = new Date();
  let from;
  switch (period) {
    case 'day':
      from = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      break;
    case 'week':
      from = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 1).toISOString();
      break;
    case 'month':
      from = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
      break;
    default:
      from = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
  }
  const req = new Request(`${HELIUM_API_BASE_URL}/v1/hotspots/${address}/rewards/sum?min_time=${from}`);
  const resp = await req.loadJSON();
  const totalHNT = resp.data.total;

  const locale = Device.locale().replace(/_/g, '-');
  const total = totalHNT * rate;

  return total.toLocaleString(locale, {
    style: 'currency',
    currency: config.CURRENCY,
  });
};

async function getAddress(name) {
  // Check if the address is in the keychain return that if so
  console.log(`getting address for ${name}`);

  // Check keychain for price data
  console.log(`checking keychain...`);
  if (!Keychain.contains(`address_${name}`)) {
    console.log('no address found in keychain...');
    // Get address from helium API
    if (!(await fetchAddress(name))) return;
    return getAddress(name);
  }
  const address = Keychain.get(`address_${name}`);
  console.log(`found address ${address} for ${name}`);
  return address;
}

async function fetchAddress(name) {
  console.log(`fetching hotspot address for ${name}...`);
  const req = new Request(`${HELIUM_API_BASE_URL}/v1/hotspots/name/${name}`);
  const resp = await req.loadJSON();
  const address = resp.data[0].address;

  Keychain.set(`address_${name}`, address);
  console.log(`saved ${address} for ${name}`);
  return true;
}

module.exports.getHeliumPrice = async function () {
  console.log('getting current helium price...');

  // Check keychain for price data
  console.log('checking cached value in keychain...');
  if (!Keychain.contains('helium_price')) {
    console.log('no data found in keychain...');
    // Request helium price from API
    if (!(await requestHeliumPriceFromAPI())) return;
    return this.getHeliumPrice();
  }

  console.log('checking if its still valid...');
  const data = JSON.parse(Keychain.get('helium_price'));
  if (Math.floor(Date.now() / 1000) >= data.updatedAt + 14400) {
    console.log('existing data is older than 4h...');
    // Request helium price from API
    if (!(await requestHeliumPriceFromAPI())) return;
    return this.getHeliumPrice();
  }

  console.log(`using cached price: ${data.price}`);
  return data.price;
};

async function requestHeliumPriceFromAPI() {
  console.log('requesting current helium price form coingecko...');
  const req = new Request(`https://api.coingecko.com/api/v3/simple/price?ids=helium&vs_currencies=${config.CURRENCY}`);
  const resp = await req.loadJSON();
  const currentPrice = resp.helium.eur;

  const data = {
    price: currentPrice,
    updatedAt: Math.floor(Date.now() / 1000),
  };

  Keychain.set('helium_price', JSON.stringify(data));
  return true;
}
