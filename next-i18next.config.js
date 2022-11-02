module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'so', 'hmn'],
    reloadOnPrerender: true,
    defaultNS: "landing",
    localeExtension: "yaml",
  },
  localePath: typeof window === 'undefined' ?
    require('path').resolve('./public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};