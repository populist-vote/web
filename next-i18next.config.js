module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'so', 'hmn'],
  },
  localeExtension: "yaml",
  defaultNS: "landing",
  localePath: typeof window === 'undefined' ?
    require('path').resolve('./public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};