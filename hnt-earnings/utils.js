module.exports.capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.getRelativeTimeString = function (time, locale) {
  // If no locale is specified use device settings
  if (locale === undefined) {
    locale = Device.locale().replace(/_/g, '-');
  }
  const formatter = new Intl.RelativeTimeFormat(locale, { style: `narrow` });

  const thenSec = new Date(time).getTime() / 1000;
  const nowSec = Math.floor(Date.now() / 1000);
  const diff = thenSec - nowSec;

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
