import ButtonProfilStyle from "./ButtonProfilStyle";
import { useUserContext } from "../../context/UserContext";
import type { ButtonProfilProps } from "../../types/ButtonProfilProps";

const ButtonProfil: React.FC<ButtonProfilProps> = ({ onClick }) => {
	const { user } = useUserContext();
	const avatarSrc =
		user?.avatar && user.avatar !== "" ? user.avatar : "/default.png";

	return (
		<button
			onClick={onClick}
			className={ButtonProfilStyle.button}
			aria-label="Paramètres"
		>
			<img src={avatarSrc} alt="Profile" className={ButtonProfilStyle.img} />
		</button>
	);
};

export default ButtonProfil;
