# HNT Earnings Widget for Scriptable
![cover](https://github.com/p0fi/hnt-earnings-for-scriptable/blob/main/cover.png)

## What's this?
Just got your [Helium](https://www.helium.com) miner? Tired of checking the helium app every other hour during the day to see how much you earned? Want to see earnings right on your iOS home screen? **Look no more!**

This [Scriptable](https://scriptable.app) widget lets you display the earnings of your hotspot on the home screen to help you keeping track of your daily/weekly/monthly earnings. 

## Features
### Multi Language Support
Currently the widget is tranlated into:
* π©πͺ German
* πΊπΈ English
* πͺπΈ Spanish

### Different Aggregation Periods
The widget can be configured to display eigther earnings per **day**, per **week** or per **month**. 

### Dark Mode Support
Supports different color configurations for light βοΈ and dark πΆοΈ mode 

## Instructions
1. Download and extract the content of this repository into the Scriptable folder located in your iCloud Drive.

Your Scriptable folder structure should look like this:

```
iCloud Drive/
ββ Scriptable/
β  ββ hnt-earnings.js
β  ββ hnt-earnings/
β  β  ββ assets/
β  β  β  ββ helium.png
β  β  ββ api.js
β  β  ββ utils.js
β  β  ββ config.js
β  β  ββ widgets.js
β  β  ββ i18n.js
```

2. If you like to display your earnings in a different currency then the default (`EUR`) go to the `config.js` file and change the currency. Possible values are listed in the file.
3. If you like, configure your color settings in the `getColors()` function to match the widget to your homescreen π¨
4. Launch Scriptable and make sure that `hnt-earnings` is listed in the scripts view.
5. If you wish, add your hotspot name into the `devParams` object in `hnt-earnings.js` and run the script and verify that everything is working correctly.
6. Go back to your home screen and add a Scriptable widget.
7. Edit the Scriptable widget and choose `hnt-earnings` as the script.
8. Configure the widget parameters with your hotspot name and the period you want to see the earnings for. 

The configuration options have to be a JSON of the following format:

```json
{ "name": "your-hotspot-name", "period": "day" }
```

## Known Issues
* Right now the widget only supports the small widget size. A medium and large sized version may follow in the future.

## About this project
The script is authored by [@thartwi](https://twitter.com/thartwi) (me) in order to keep track on how much I'm making with my magic internet money box β¨ without opening the helium app constantly and waiting for it to load slowly π

## Thanks π
Thanks to the [Helium Network](https://www.helium.com) for creating the peoples network!\
Thanks to [@simonbs](https://twitter.com/simonbs) for making an awesome app!

## Disclaimer
This widget is not affiliated with or endorsed by the Helium project.
