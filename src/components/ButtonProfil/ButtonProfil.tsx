import ButtonProfilStyle from './ButtonProfilStyle';

interface ButtonProfilProps {
	onClick?: () => void;
	img: string;
}

export default function ButtonProfil({ onClick, img }: ButtonProfilProps) {
	return (
		<button onClick={onClick} className={ButtonProfilStyle.button} aria-label="Paramètres">
			<img src={img} alt="Profile" className={ButtonProfilStyle.img} />
		</button>
	);
}
