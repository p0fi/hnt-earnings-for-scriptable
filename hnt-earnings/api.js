const config = importModule('config');
const cache = importModule('cache');

const HELIUM_API_BASE_URL = 'https://api.helium.io';

module.exports.getEarnings = async function (name, period) {
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
  console.log('📡 fetching total rewards...');
  const req = new Request(`${HELIUM_API_BASE_URL}/v1/hotspots/${address}/rewards/sum?min_time=${from}`);
  req.timeoutInterval = 10;

  try {
    const resp = await req.loadJSON();
    const totalHNT = resp.data.total;

    //Add rewards to cache
    let data = await cache.load(name);
    data = { ...data, rewards: { ...data.rewards, [period]: totalHNT } };
    await cache.save(name, data);

    return { rewards: totalHNT, cached: false };
  } catch {
    // Sucker Helium API seems not working, use old value from cache
    console.log('api call failed, using cached value...');
    let data = await cache.load(name);
    // Potential Problem: API Call fails and there is no cache
    return { rewards: data.rewards[period], cached: true };
  }
};

async function getAddress(name) {
  // Check if a chache file exists for this hotspot
  console.log(`getting address for ${name}`);

  // Check cache for hotspot data
  const data = await cache.load(name);
  if (!data) {
    console.log('no cache found...');
    // Get address from helium API
    if (!(await fetchAddress(name))) return;
    return getAddress(name);
  }
  console.log(`💾 using cached address`);
  return data.address;
}

async function fetchAddress(name) {
  console.log(`📡 fetching hotspot address for ${name}...`);
  const req = new Request(`${HELIUM_API_BASE_URL}/v1/hotspots/name/${name}`);
  const resp = await req.loadJSON();
  const address = resp.data[0].address;

  let data = await cache.load(name);
  if (!data) {
    console.log(`creating cache file for ${name}...`);
    data = { address: address };
  } else {
    data = { ...data, address: address };
  }

  await cache.save(name, data);

  console.log(`saved ${address} for ${name}`);
  return true;
}

module.exports.getHeliumPrice = async function () {
  if (config.CURRENCY == 'HNT') return 1;
  console.log('getting helium price...');

  // Check cache for price data
  const data = await cache.load('price');
  if (!data || !data.hasOwnProperty(config.CURRENCY)) {
    console.log('no cache found...');
    // Request helium price from API
    if (!(await requestHeliumPriceFromAPI())) return;
    return this.getHeliumPrice();
  }

  if (Math.floor(Date.now() / 1000) >= data[config.CURRENCY].updated + 14400) {
    console.log('cache data is older than 4h...');
    // Request helium price from API
    if (!(await requestHeliumPriceFromAPI())) return;
    return this.getHeliumPrice();
  }

  console.log(`💾 cached price: ${data[config.CURRENCY].rate}`);
  return data[config.CURRENCY].rate;
};

async function requestHeliumPriceFromAPI() {
  console.log('📡 fetching current helium price form coingecko...');
  const req = new Request(`https://api.coingecko.com/api/v3/simple/price?ids=helium&vs_currencies=${config.CURRENCY}`);
  const resp = await req.loadJSON();
  const currentPrice = resp.helium[config.CURRENCY.toLowerCase()];

  const obj = { rate: currentPrice, updated: Math.floor(Date.now() / 1000) };

  let data = await cache.load('price');
  data = { ...data, [config.CURRENCY]: obj };

  await cache.save('price', data, false);
  return true;
}

module.exports.getRewardDetails = async function (rate, name) {
  const address = await getAddress(name);

  const d = new Date();
  const from = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 4).toISOString();
  console.log('📡 fetching cursor...');
  const req1 = new Request(`${HELIUM_API_BASE_URL}/v1/hotspots/${address}/rewards?min_time=${from}`);

  try {
    const resp1 = await req1.loadJSON();
    const cursor = resp1.cursor;

    let test = await cache.load('cursors');
    const entry = { ...test, [Math.floor(Date.now() / 1000)]: cursor };
    await cache.save('cursors', entry);

    console.log('📡 fetching reward details...');
    const req2 = new Request(`${HELIUM_API_BASE_URL}/v1/hotspots/${address}/rewards?cursor=${cursor}`);

    const resp = await req2.loadJSON();
    const data = resp.data;

    lastWitness = data.find((obj) => obj.type === 'poc_witness');
    lastChallenge = data.find((obj) => obj.type === 'poc_challenger');
    lastBeacon = data.find((obj) => obj.type === 'poc_challengee');

    const activities = {
      beacon: {
        timestamp: new Date(lastBeacon.timestamp).getTime() / 1000,
        reward: lastBeacon.amount / 100000000,
      },
      witness: {
        timestamp: new Date(lastWitness.timestamp).getTime() / 1000,
        reward: lastWitness.amount / 100000000,
      },
      challenge: {
        timestamp: new Date(lastChallenge.timestamp).getTime() / 1000,
        reward: lastChallenge.amount / 100000000,
      },
    };

    let data2 = await cache.load(name);
    data2 = { ...data2, activities: activities };
    await cache.save(name, data2);

    return activities;
  } catch {
    console.log('api call failed, using cached value...');
    let data = await cache.load(name);
    // Potential Problem: API Call fails and there is no cache
    return { ...data.activities, cached: true };
  }
};
