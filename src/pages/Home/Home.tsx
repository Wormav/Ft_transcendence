import React from 'react';
import Card, { Space } from '../../components/Card/Card';
import { useTranslation } from '../../context/TranslationContext';
import globalStyle from '../../globalStyle';
import ProfilHomeCard from '../../components/Cards/ProfilHomeCard/ProfilHomeCard';
import NewGameCard from '../../components/Cards/NewGameCard/NewGameCard';

const Home: React.FC = () => {
	const { t } = useTranslation();

	return (
		<>
			<Card>
				<div className={globalStyle.row}>
					<p>{t('home.welcom')}</p>
					<Space />
					<span className={globalStyle.span}>{'Ft_transcendence'}</span>
				</div>
			</Card>
			<div className={globalStyle.cardContainer}>
				<ProfilHomeCard />
				<NewGameCard ai={true} />
				<NewGameCard ai={false} />
			</div>
		</>
	);
};

export default Home;
