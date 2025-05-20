import { useSettings } from "../../context/SettingsContext";
import { getSizeTextStyle } from "../../globalStyle";
import FriendsStyle from "./FriendsStyle";

export default function FriendStatusMessage({ status }: { status: string }) {
	const { size_text } = useSettings();

	return (
		<div
			className={`${FriendsStyle.statusContainer} ${getSizeTextStyle(size_text)}`}
		>
			<span
				className={
					status === "online"
						? FriendsStyle.onlineIndicator
						: FriendsStyle.offlineIndicator
				}
			></span>
			<span
				className={`${FriendsStyle.statusText} ${getSizeTextStyle(size_text)}`}
			>
				{status === "online" ? "En ligne" : "Hors ligne"}
			</span>
		</div>
	);
}
