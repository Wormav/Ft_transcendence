import Card, { Space } from "../../components/Card/Card";
import { useTranslation } from "../../context/TranslationContext";
import globalStyle from "../../globalStyle";
import { useWindowSize } from "../../hooks/useWindowSize";
import ProfilHomeCard from "../../components/Cards/ProfilHomeCard/ProfilHomeCard";
import NewGameCard from "../../components/Cards/NewGameCard/NewGameCard";
import ResultsCard from "../../components/Cards/ResultsCard/ResultsCard";
import { useEffect } from "react";

const Home: React.FC = () => {
	const { t } = useTranslation();
	const { width } = useWindowSize();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		if (code) {
			document.cookie = `jwt=${code}; path=/; secure; samesite=strict`;
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, []);

	return (
		<>
			<Card>
				<div className={width > 400 ? globalStyle.row : undefined}>
					<p>{t("home.welcom")}</p>
					<Space />
					<span className={globalStyle.span}>{"Ft_transcendence"}</span>
				</div>
			</Card>
			<div className={globalStyle.cardContainer}>
				<ProfilHomeCard home={true} />
				<NewGameCard ai={true} />
				<ResultsCard />
				<NewGameCard ai={false} />
			</div>
		</>
	);
};

export default Home;
