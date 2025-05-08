import { createContext, useState, useContext, useEffect } from 'react';

import frTranslations from '../locales/fr.json';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
import type { Locale, TranslationContextType, Translations } from '../types/TranslationTypes';

const TranslationContext = createContext<TranslationContextType>({
	locale: 'fr',
	translations: {},
	setLocale: () => {},
	t: () => '',
});

const getNestedTranslation = (obj: Translations, path: string): string => {
	const keys = path.split('.');
	let current: any = obj;

	for (const key of keys) {
		if (current[key] === undefined) {
			console.warn(`Translation key not found: ${path}`);
			return path;
		}
		current = current[key];
	}

	if (typeof current !== 'string') {
		console.warn(`Translation key does not point to a string: ${path}`);
		return path;
	}

	return current;
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const savedLocale = localStorage.getItem('locale') as Locale;
	const [locale, setLocale] = useState<Locale>(savedLocale || 'en');
	const [translations, setTranslations] = useState<Translations>(
		locale === 'fr' ? frTranslations : locale === 'es' ? esTranslations : enTranslations
	);

	useEffect(() => {
		setTranslations(
			locale === 'fr' ? frTranslations : locale === 'es' ? esTranslations : enTranslations
		);
		localStorage.setItem('locale', locale);
	}, [locale]);

	const t = (key: string): string => {
		return getNestedTranslation(translations, key);
	};

	return (
		<TranslationContext.Provider value={{ locale, translations, setLocale, t }}>
			{children}
		</TranslationContext.Provider>
	);
};

export const useTranslation = () => useContext(TranslationContext);
