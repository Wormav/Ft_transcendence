import type { CustomBtnProps } from '../../types/CustomBtnProps';
import CustomBtnStyle from './CustomBtnStyle';

export default function CustomBtn({ text, onClick, disabled = false }: CustomBtnProps) {
	return (
		<button
			className={`${CustomBtnStyle.button} ${
				disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
			}`}
			onClick={onClick}
			disabled={disabled}
		>
			{text}
		</button>
	);
}
