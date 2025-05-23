import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { useTranslation } from "../../context/TranslationContext";
import { getSizeTextStyle } from "../../globalStyle";
import NotFoundStyle from "./NotFoundStyle";

export default function NotFound() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { size_text } = useSettings();

	return (
		<div className={NotFoundStyle.container}>
			<div className={NotFoundStyle.card}>
				<img src="/42_Logo.svg.png" alt="404" className={NotFoundStyle.image} />
				<h1 className={`${NotFoundStyle.title} ${getSizeTextStyle(size_text)}`}>
					{t("notFound.title")}
				</h1>
				<p
					className={`${NotFoundStyle.description} ${getSizeTextStyle(size_text)}`}
				>
					{t("notFound.description")}
				</p>
				<button
					onClick={() => navigate("/")}
					className={`${NotFoundStyle.button} ${getSizeTextStyle(size_text)}`}
				>
					{t("notFound.backHome")}
				</button>
			</div>
		</div>
	);
}
