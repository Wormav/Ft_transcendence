import React from 'react';
import Card from '../../components/Card/Card';
import { useTranslation } from '../../context/TranslationContext';

const Home: React.FC = () => {
	const { t } = useTranslation();

	return <Card>{t('home.welcom')}</Card>;
};

export default Home;
