import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',

    ns: ['common', 'home', 'form', 'contact', 'blog', 'about'],
    defaultNS: 'common',

    backend: {
      loadPath: '/language/{{lng}}/{{ns}}.json',
    },

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n