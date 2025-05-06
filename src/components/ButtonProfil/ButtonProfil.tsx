import type { ButtonProfilProps } from '../../types/ButtonProfilProps';
import ButtonProfilStyle from './ButtonProfilStyle';

export default function ButtonProfil({ onClick, img }: ButtonProfilProps) {
	return (
		<button onClick={onClick} className={ButtonProfilStyle.button} aria-label="Paramètres">
			<img src={img} alt="Profile" className={ButtonProfilStyle.img} />
		</button>
	);
}
