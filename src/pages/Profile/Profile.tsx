import ProfilHomeCard from "../../components/Cards/ProfilHomeCard/ProfilHomeCard";
import ResultsCard from "../../components/Cards/ResultsCard/ResultsCard";
import globalStyle from "../../globalStyle";

export default function Profile() {
	return (
		<div className={globalStyle.cardContainer}>
			<ProfilHomeCard home={true} />
			<ResultsCard />
		</div>
	);
}
