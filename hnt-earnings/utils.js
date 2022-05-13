const api = importModule('api');
const config = importModule('config');

module.exports.capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.convertToCurrencyString = async function (amount, currency) {
  const rate = await api.getHeliumPrice(currency);
  const result = amount * rate;
  return result.toLocaleString(config.LOCALE, { style: 'currency', currency: config.CURRENCY });
};

module.exports.getRelativeTimeString = function (then, locale) {
  // If no locale is specified use device settings
  if (locale === undefined) {
    locale = Device.locale().replace(/_/g, '-');
  }
  const formatter = new Intl.RelativeTimeFormat(locale, { style: `narrow` });

  const now = Math.floor(Date.now() / 1000);
  const diff = then - now;

  if (Math.abs(diff) < 60) {
    return formatter.format(diff, 'seconds');
  } else if (Math.abs(diff) < 3600) {
    return formatter.format(Math.floor(diff / 60), 'minutes');
  } else {
    return formatter.format(Math.floor(diff / 3600), 'hours');
  }
};

module.exports.getAsset = async function (name) {
  let fm = FileManager.iCloud();
  let dir = fm.documentsDirectory();
  let path = fm.joinPath(dir + '/hnt-earnings/assets', name);
  let download = await fm.downloadFileFromiCloud(path);
  let isDownloaded = await fm.isFileDownloaded(path);

  if (fm.fileExists(path)) {
    return fm.readImage(path);
  } else {
    console.log('Error: File does not exist.');
  }
};
