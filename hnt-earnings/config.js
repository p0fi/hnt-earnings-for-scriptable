/* 
  General Configuration
*/
const locale = Device.locale().replace(/_/g, '-');

module.exports = {
  CURRENCY: 'EUR', // Possible values: HNT, EUR, USD, JPY, NOK, GBP, RUB, AUD, CAD, MXN
  LOCALE: locale,
};

/*
  Color Configuration

  Choose the colors of the text, background and icons  
  Different settings for dark and light mode are possible
  
  Reference colors:
  helium.com pink -> #474DFF
  helium.com green -> #20DDB0
*/

const DARK_BG = '#1D1D1D';
const DARK_TEXT = '#FFFFFF';
const DARK_TEXT_SECONDARY = '#797979';
const LIGHT_BG = '#FFFFFF';
const LIGHT_TEXT = '#000000';
const LIGHT_TEXT_SECONDARY = '#999999';
const LOGO_TINT = '#474DFF';

module.exports.getColors = function () {
  // General
  const tintColor = new Color(LOGO_TINT);
  // Dark Mode
  const darkBackgroud = new Color(DARK_BG);
  const darkText = new Color(DARK_TEXT);
  const secondaryDarkText = new Color(DARK_TEXT_SECONDARY);

  // Light Mode
  const lightBackgroud = new Color(LIGHT_BG);
  const lightText = new Color(LIGHT_TEXT);
  const secondaryLightText = new Color(LIGHT_TEXT_SECONDARY);

  return {
    bgColor: Color.dynamic(lightBackgroud, darkBackgroud),
    text: Color.dynamic(lightText, darkText),
    secondaryText: Color.dynamic(secondaryLightText, secondaryDarkText),
    tintColor: tintColor,
  };
};
