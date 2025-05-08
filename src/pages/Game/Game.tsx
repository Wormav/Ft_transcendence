import CustomGameCard from '../../components/Cards/CustomGameCard/CustomGameCard';
import NewGameCard from '../../components/Cards/NewGameCard/NewGameCard';
import globalStyle from '../../globalStyle';

const Game: React.FC = () => {

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
