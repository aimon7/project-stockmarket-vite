import LngDetector from 'i18next-browser-languagedetector';
import { TRANSLATIONS_EL } from './el';
import { TRANSLATIONS_EN } from './en';
import i18nImpl from 'i18next';
import { initReactI18next } from 'react-i18next';

export interface ILocale {
    handle: string;
    engName: string;
}

export enum LocaleHandle {
    en = 'en',
    el = 'el',
}

export const LOCALES: Record<LocaleHandle, ILocale> = {
    en: {
        handle: LocaleHandle.en,
        engName: 'English'
    },
    el: {
        handle: LocaleHandle.el,
        engName: 'Greek'
    }
};

i18nImpl
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LngDetector)
    .init({
        resources: {
            en: {
                translation: TRANSLATIONS_EN
            },
            el: {
                translation: TRANSLATIONS_EL
            }
        },
        fallbackLng: LOCALES.en.handle,
        lng: LOCALES.en.handle,
        debug: false,
        react: {
            transSupportBasicHtmlNodes: true
        },
        interpolation: {
            escapeValue: false
        },

        detection: {
            order: [
                'querystring',
                'path',
                'navigator',
                'htmlTag',
                'subdomain',
                'localStorage',
                'cookie'
            ]
        },
        returnObjects: true
    });

export default i18nImpl;
export const i18n = i18nImpl;
