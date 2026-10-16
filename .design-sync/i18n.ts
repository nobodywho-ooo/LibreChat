// The LibreChat app initializes i18next at startup; @librechat/client only calls
// useTranslation(). Without this, components render raw keys (com_ui_cancel).
// Merged into window.LibreChatClient via cfg.extraEntries, so it runs when the
// bundle loads - in previews and in every design.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from '../packages/client/src/locales/en/translation.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation } },
  interpolation: { escapeValue: false },
});

export const libreChatI18n = i18n;
