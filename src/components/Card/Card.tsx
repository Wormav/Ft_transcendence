import { type ReactNode } from 'react';
import CardStyle from './CardStyle';

interface CardProps {
	children: ReactNode;
}

export default function Card({ children }: CardProps) {
	return <div className={CardStyle.container}>{children}</div>;
}
