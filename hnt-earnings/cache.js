module.exports.load = async function (name) {
  let fm = FileManager.iCloud();
  let dir = fm.documentsDirectory();
  let path = fm.joinPath(dir + '/hnt-earnings/cache', `${name}.json`);

  if (fm.fileExists(path)) {
    const download = await fm.downloadFileFromiCloud(path);
    const isDownloaded = await fm.isFileDownloaded(path);

    const content = fm.readString(path);
    return JSON.parse(content);
  }
};

module.exports.save = async function (name, cache, addTimestamp = true) {
  let fm = FileManager.iCloud();
  let dir = fm.documentsDirectory();
  let path = fm.joinPath(dir + '/hnt-earnings/cache', `${name}.json`);

  if (addTimestamp === true) {
    cache = { ...cache, updated: Math.floor(Date.now() / 1000) };
  }

  const content = JSON.stringify(cache, null, 2);

  fm.writeString(path, content);
};
