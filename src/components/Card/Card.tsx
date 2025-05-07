import type { CardProps } from '../../types/CardProps';
import CardStyle from './CardStyle';

export const Space = () => <span className="whitespace-pre">&nbsp;</span>;

export default function Card({ children }: CardProps) {
	return <div className={CardStyle.container}>{children}</div>;
}
