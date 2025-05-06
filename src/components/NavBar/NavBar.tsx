import React from 'react';
import NavBarStyles from './NavBarStyles';
import type { NavBarProps } from '../../types/NavBarProps';

const NavBar: React.FC<NavBarProps> = ({ onMenuClick }) => {
	return (
		<header className={NavBarStyles.container}>
			<div className={NavBarStyles.content}>
				<button onClick={onMenuClick} className={NavBarStyles.menuButton}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="#00BABC"
					>
						<defs>
							<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
								<feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.4" floodColor="#000" />
							</filter>
						</defs>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={3}
							d="M4 6h16M4 12h16M4 18h16"
							filter="url(#shadow)"
						/>
					</svg>
				</button>
			</div>
		</header>
	);
};

export default NavBar;
