// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: hand-holding-usd;
const utils = importModule('hnt-earnings/utils');
const widgets = importModule('hnt-earnings/widgets');

// The hotspot name has to be configured via the widget parameter on the homescreen
const params = args.widgetParameter != null ? JSON.parse(args.widgetParameter) : { name: '', period: 'day' };
const devParams = { name: '', period: 'day' };

if (config.runsInWidget) {
  const size = config.widgetFamily;
  let widget;
  switch (size) {
    case 'small':
      widget = await widgets.small(params);
      break;
    case 'medium':
      widget = await widgets.medium(params);
      break;
    case 'large':
      widget = await widgets.large(params);
      break;
    default:
      widget = await widgets.small(params);
  }
  Script.setWidget(widget);
} else {
  // Choose any size for debugging
  const size = 'small';
  //const size = 'medium'
  //const size = 'large'
  let widget;
  switch (size) {
    case 'small':
      widget = await widgets.small(devParams);
      widget.presentSmall();
      break;
    case 'medium':
      widget = await widgets.medium(devParams);
      widget.presentMedium();
      break;
    case 'large':
      widget = await widgets.large(devParams);
      widget.presentLarge();
      break;
    default:
      widget = await widgets.small(devParams);
      widget.presentSmall();
  }
}
Script.complete();
