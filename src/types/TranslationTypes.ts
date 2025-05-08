export type Locale = 'fr' | 'en' | 'es';

export type Translations = {
	[key: string]: string | Translations;
};

export type TranslationContextType = {
	locale: Locale;
	translations: Translations;
	setLocale: (locale: Locale) => void;
	t: (key: string) => string;
};
