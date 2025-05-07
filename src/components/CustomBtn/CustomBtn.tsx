import type { CustomBtnProps } from '../../types/CustomBtnProps';
import CustomBtnStyle from './CustomBtnStyle';

export default function CustomBtn({ text, onClick }: CustomBtnProps) {
	return (
		<button className={CustomBtnStyle.button} onClick={onClick}>
			{text}
		</button>
	);
}
