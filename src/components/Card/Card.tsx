import { type ReactNode } from 'react';
import CardStyle from './CardStyle';

interface CardProps {
	children: ReactNode;
}

// Composant d'espace qui ne sera pas supprimé par le formatage
export const Space = () => <span className="whitespace-pre">&nbsp;</span>;

export default function Card({ children }: CardProps) {
	return <div className={CardStyle.container}>{children}</div>;
}
