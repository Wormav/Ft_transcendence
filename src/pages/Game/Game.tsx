import CustomGameCard from '../../components/Cards/CustomGameCard/CustomGameCard';
import NewGameCard from '../../components/Cards/NewGameCard/NewGameCard';
import { useTranslation } from '../../context/TranslationContext';
import globalStyle from '../../globalStyle';

const Game: React.FC = () => {
	const { t } = useTranslation();

	return (
		<>
			<div className={globalStyle.cardContainer}>
				<NewGameCard ai={true}/>
				<NewGameCard />
				<CustomGameCard />
			</div>
		</>
	);
};

export default Game;
