const api = importModule('api');
const utils = importModule('utils');
const conf = importModule('config');
const i18n = importModule('i18n');

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

  const rate = await api.getHeliumPrice();
  const earningsToday = await api.getEarnings(rate, params.name, params.period);

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
  let earningsText = numberStack.addText(earningsToday);
  earningsText.font = Font.boldSystemFont(32);
  earningsText.textColor = colors.text;
  earningsText.minimumScaleFactor = 0.5;

  earningsStack.addSpacer();

  w.addSpacer();

  // Rate and updated text
  const updatedStack = w.addStack();
  updatedStack.layoutHorizontally();

  const formattedRate = rate.toLocaleString(conf.LOCALE, { style: 'currency', currency: conf.CURRENCY });

  if (conf.CURRENCY != 'HNT') {
    const rateText = updatedStack.addText(`${formattedRate}/HNT`);
    rateText.font = Font.systemFont(9);
    rateText.textColor = colors.secondaryText;
  }

  updatedStack.addSpacer();

  const updateImg = SFSymbol.named('arrow.triangle.2.circlepath').image;
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

  w.addText('to be implemented...');

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
