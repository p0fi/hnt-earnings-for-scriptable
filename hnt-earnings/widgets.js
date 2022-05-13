const utils = importModule('utils');
const conf = importModule('config');
const i18n = importModule('i18n');
const api = importModule('api');

const colors = conf.getColors();

module.exports.missingParameter = function () {
  let w = new ListWidget();
  w.backgroundColor = colors.bgColor;

  const titleText = w.addText('Missing Parameter');
  titleText.font = Font.boldSystemFont(16);
  titleText.textColor = Color.red();

  w.addSpacer();

  const errorText = w.addText('Please configure a hotspot name in the widget parameters');
  errorText.font = Font.systemFont(12);
  errorText.textColor = Color.red();

  w.addSpacer();
  return w;
};

// Small widget
module.exports.small = async function (params) {
  let w = new ListWidget();
  w.setPadding(15, 15, 10, 15);
  w.backgroundColor = colors.bgColor;

  if (params.name === '') {
    return this.missingParameter();
  }

  const earnings = await api.getEarnings(params.name, params.period);

  const headerStack = w.addStack();
  headerStack.layoutHorizontally();

  // Helium logo
  let img = await utils.getAsset('helium.png');
  const heliumLogo = headerStack.addImage(img);
  heliumLogo.imageSize = new Size(30, 30);
  heliumLogo.tintColor = colors.tintColor;

  headerStack.addSpacer();

  // Hotspot name
  const hsNameStack = headerStack.addStack();
  hsNameStack.layoutVertically();
  const nameStack1 = hsNameStack.addStack();
  nameStack1.layoutHorizontally();
  const nameStack2 = hsNameStack.addStack();
  nameStack2.layoutHorizontally();

  const nameComponents = params.name.split('-').map((element) => utils.capitalizeFirstLetter(element));

  nameStack1.addSpacer();
  const nameText = nameStack1.addText(`${nameComponents[0]} ${nameComponents[1]}`);
  nameText.font = Font.systemFont(12);
  nameText.textColor = colors.text;

  nameStack2.addSpacer();

  const mainNameText = nameStack2.addText(`${nameComponents[2]}`);
  mainNameText.font = Font.boldSystemFont(20);
  mainNameText.textColor = colors.text;

  w.addSpacer();

  const earningsStack = w.addStack();
  earningsStack.layoutHorizontally();

  earningsStack.addSpacer();

  const numberStack = earningsStack.addStack();
  numberStack.layoutVertically();

  // Earnings
  const periodText = numberStack.addText(i18n.t(params.period));
  periodText.font = Font.boldSystemFont(12);
  periodText.textColor = colors.secondaryText;
  let earningsText = numberStack.addText(await utils.convertToCurrencyString(earnings.rewards, conf.CURRENCY));
  earningsText.font = Font.boldSystemFont(32);
  earningsText.textColor = colors.text;
  earningsText.minimumScaleFactor = 0.5;

  earningsStack.addSpacer();

  w.addSpacer();

  // Rate and updated text
  const updatedStack = w.addStack();
  updatedStack.layoutHorizontally();

  const rate = await api.getHeliumPrice();
  const formattedRate = rate.toLocaleString(conf.LOCALE, { style: 'currency', currency: conf.CURRENCY });

  if (conf.CURRENCY != 'HNT') {
    const rateText = updatedStack.addText(`${formattedRate}/HNT`);
    rateText.font = Font.systemFont(9);
    rateText.textColor = colors.secondaryText;
  }

  updatedStack.addSpacer();

  const imageName = earnings.cached === false ? 'arrow.triangle.2.circlepath' : 'bolt.horizontal.circle';
  const updateImg = SFSymbol.named(imageName).image;
  const updateIcon = updatedStack.addImage(updateImg);
  updateIcon.imageSize = new Size(11, 11);
  updateIcon.tintColor = colors.secondaryText;

  updatedStack.addSpacer(2);

  const updated = new Date();
  const updateText = updatedStack.addText(`${updated.toLocaleTimeString()}`);
  updateText.font = Font.systemFont(9);
  updateText.textColor = colors.secondaryText;

  return w;
};

// Medium widget
module.exports.medium = async function (params) {
  let w = new ListWidget();
  w.setPadding(15, 15, 10, 15);
  w.backgroundColor = colors.bgColor;

  if (params.name === '') {
    return this.missingParameter();
  }

  const rate = await api.getHeliumPrice();
  const earnings = await api.getEarnings(params.name, params.period);
  const pocReceipts = await api.getRewardDetails(rate, params.name);

  const contentStack = w.addStack();
  contentStack.layoutHorizontally();

  // Helium logo
  {
    let img = await utils.getAsset('helium.png');
    const heliumLogo = contentStack.addImage(img);
    heliumLogo.imageSize = new Size(30, 30);
    heliumLogo.tintColor = colors.tintColor;
  }

  contentStack.addSpacer(15);

  // Activities
  {
    const activitiesStack = contentStack.addStack();
    activitiesStack.layoutVertically();

    activitiesStack.addSpacer(20);

    const beaconHeader = activitiesStack.addText(i18n.t('last-beacon'));
    beaconHeader.font = Font.boldSystemFont(9);
    beaconHeader.textColor = colors.secondaryText;
    const beaconInfo = activitiesStack.addStack();
    beaconInfo.layoutHorizontally();

    const beaconTime = beaconInfo.addText(utils.getRelativeTimeString(pocReceipts.beacon.timestamp));
    beaconInfo.addSpacer(10);
    const beaconReward = beaconInfo.addText(
      await utils.convertToCurrencyString(pocReceipts.beacon.reward, conf.CURRENCY)
    );
    beaconTime.font = Font.systemFont(12);
    beaconReward.font = Font.systemFont(12);

    activitiesStack.addSpacer(5);

    const witnessHeader = activitiesStack.addText(i18n.t('last-witness'));
    witnessHeader.font = Font.boldSystemFont(9);
    witnessHeader.textColor = colors.secondaryText;
    const witnessInfo = activitiesStack.addStack();
    witnessInfo.layoutHorizontally();
    const witnessTime = witnessInfo.addText(utils.getRelativeTimeString(pocReceipts.witness.timestamp));
    witnessInfo.addSpacer(10);
    const witnessReward = witnessInfo.addText(
      await utils.convertToCurrencyString(pocReceipts.witness.reward, conf.CURRENCY)
    );
    witnessReward.font = Font.systemFont(12);
    witnessTime.font = Font.systemFont(12);

    activitiesStack.addSpacer(5);

    const challengeHeader = activitiesStack.addText(i18n.t('last-challenge'));
    challengeHeader.font = Font.boldSystemFont(9);
    challengeHeader.textColor = colors.secondaryText;
    const challengeInfo = activitiesStack.addStack();
    challengeInfo.layoutHorizontally();
    const challengeTime = challengeInfo.addText(utils.getRelativeTimeString(pocReceipts.challenge.timestamp));
    challengeInfo.addSpacer(10);
    const challengeReward = challengeInfo.addText(
      await utils.convertToCurrencyString(pocReceipts.challenge.reward, conf.CURRENCY)
    );
    challengeReward.font = Font.systemFont(12);
    challengeTime.font = Font.systemFont(12);

    activitiesStack.addSpacer();
  }

  contentStack.addSpacer();

  // Earnings & Name
  {
    const earningsStack = contentStack.addStack();
    earningsStack.layoutVertically();

    // Hotspot name
    {
      const nameComponents = params.name.split('-').map((element) => utils.capitalizeFirstLetter(element));

      const nameStack1 = earningsStack.addStack();
      nameStack1.layoutHorizontally();
      const nameStack2 = earningsStack.addStack();
      nameStack2.layoutHorizontally();

      nameStack1.addSpacer();
      const nameText = nameStack1.addText(`${nameComponents[0]} ${nameComponents[1]}`);
      nameText.font = Font.systemFont(12);
      nameText.textColor = colors.text;

      nameStack2.addSpacer();

      const mainNameText = nameStack2.addText(`${nameComponents[2]}`);
      mainNameText.font = Font.boldSystemFont(20);
      mainNameText.textColor = colors.text;
    }

    earningsStack.addSpacer();

    const alignmentStack = earningsStack.addStack();
    alignmentStack.layoutHorizontally();

    alignmentStack.addSpacer();

    const numberStack = alignmentStack.addStack();
    numberStack.layoutVertically();

    const periodText = numberStack.addText(i18n.t(params.period));
    periodText.font = Font.boldSystemFont(12);
    periodText.textColor = colors.secondaryText;
    let earningsText = numberStack.addText(await utils.convertToCurrencyString(earnings.rewards, conf.CURRENCY));
    earningsText.font = Font.boldSystemFont(32);
    earningsText.textColor = colors.text;
    earningsText.minimumScaleFactor = 0.5;

    numberStack.addSpacer();
    alignmentStack.addSpacer();

    earningsStack.addSpacer();
  }

  contentStack.addSpacer();

  w.addSpacer();

  // Rate and updated text
  {
    const updatedStack = w.addStack();
    updatedStack.layoutHorizontally();

    const formattedRate = rate.toLocaleString(conf.LOCALE, { style: 'currency', currency: conf.CURRENCY });

    if (conf.CURRENCY != 'HNT') {
      const rateText = updatedStack.addText(`${formattedRate}/HNT`);
      rateText.font = Font.systemFont(9);
      rateText.textColor = colors.secondaryText;
    }

    updatedStack.addSpacer();

    const showingCachedData = pocReceipts.cached || earnings.cached;
    const imageName = showingCachedData === false ? 'arrow.triangle.2.circlepath' : 'bolt.horizontal.circle';

    const updateImg = SFSymbol.named(imageName).image;
    const updateIcon = updatedStack.addImage(updateImg);
    updateIcon.imageSize = new Size(11, 11);
    updateIcon.tintColor = colors.secondaryText;

    updatedStack.addSpacer(2);

    const updated = new Date();
    const updateText = updatedStack.addText(`${updated.toLocaleTimeString()}`);
    updateText.font = Font.systemFont(9);
    updateText.textColor = colors.secondaryText;
  }
  return w;
};

// Large widget
module.exports.large = async function (params) {
  let w = new ListWidget();
  w.setPadding(15, 15, 10, 15);
  w.backgroundColor = colors.bgColor;

  if (params.name === '') {
    return this.missingParameter();
  }

  w.addText('to be implemented...');

  return w;
};
