import type { ButtonProfilProps } from '../../types/ButtonProfilProps';
import ButtonProfilStyle from './ButtonProfilStyle';
import { useUser } from '../../context/UserContext';

export default function ButtonProfil({ onClick }: ButtonProfilProps) {
	const { user } = useUser();

	// Utiliser l'avatar de l'utilisateur s'il existe, sinon l'image par défaut
	const avatarSrc = user?.avatar && user.avatar !== "" ? user.avatar : '/default.JPG';

	return (
		<button onClick={onClick} className={ButtonProfilStyle.button} aria-label="Paramètres">
			<img src={avatarSrc} alt="Profile" className={ButtonProfilStyle.img} />
		</button>
	);
}
