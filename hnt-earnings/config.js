/* 
  General Configuration
*/
const locale = Device.locale().replace(/_/g, '-');

module.exports = {
  CURRENCY: 'EUR',
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
const DARK_TEXT = '#E3E3E3';
const LIGHT_BG = '#FFFFFF';
const LIGHT_TEXT = '#000000';
const LOGO_TINT = '#474DFF';

module.exports.getColors = function () {
  // General
  const tintColor = new Color(LOGO_TINT);
  // Dark Mode
  const darkBackgroud = new Color(DARK_BG);
  const darkText = new Color(DARK_TEXT);

  // Light Mode
  const lightBackgroud = new Color(LIGHT_BG);
  const lightText = new Color(LIGHT_TEXT);

  return {
    bgColor: Color.dynamic(lightBackgroud, darkBackgroud),
    textColor: Color.dynamic(lightText, darkText),
    tintColor: tintColor,
  };
};
