module.exports.t = function (key, locale) {
  // If no locale is specified use device settings
  if (locale === undefined) {
    locale = Device.locale().replace(/_/g, '-');
  }
  switch (locale) {
    case 'de-DE':
      switch (key) {
        case 'day':
          return 'Heute';
        case 'week':
          return 'Diese Woche';
        case 'month':
          return 'Dieser Monat';
        case 'last-beacon':
          return 'Letzter Beacon';
        case 'last-witness':
          return 'Letzter Witness';
        case 'last-challenge':
          return 'Letzte Challenge';

        default:
          return 'key not found';
      }
      break;
    case 'es-ES':
      switch (key) {
        case 'day':
          return 'Hoy';
        case 'week':
          return 'Esta semana';
        case 'month':
          return 'Este mes';
        case 'last-beacon':
          return 'Último Beacon';
        case 'last-witness':
          return 'Último testigo';
        case 'last-challenge':
          return 'Último desafío';

        default:
          return 'key not found';
      }
      break;
    default:
    case 'en-EN':
      switch (key) {
        case 'day':
          return 'Today';
        case 'week':
          return 'This Week';
        case 'month':
          return 'This Month';
        case 'last-beacon':
          return 'Last Beacon';
        case 'last-witness':
          return 'Last Witness';
        case 'last-challenge':
          return 'Last Challenge';

        default:
          return 'key not found';
      }
      break;
  }
};
