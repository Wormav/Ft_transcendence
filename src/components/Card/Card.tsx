import { useSettings } from '../../context/SettingsContext';
import { getSizeTextStyle } from '../../globalStyle';
import type { CardProps } from '../../types/CardProps';
import CardStyle from './CardStyle';

export const Space = () => <span className="whitespace-pre">&nbsp;</span>;

export default function Card({ children }: CardProps) {
	const { size_text } = useSettings();
	return <div className={`${CardStyle.container} ${getSizeTextStyle(size_text)}`}>{children}</div>;
}
