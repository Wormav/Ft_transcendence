import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BugerMenuStyles } from './BugerMenuStyles';
import type { BurgerMenuProps } from '../../types/BurgerMenuProps';
import { useTranslation } from '../../context/TranslationContext';
import { useSettings } from '../../context/SettingsContext';
import { getSizeTextStyle } from '../../globalStyle';

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClose }) => {
	const location = useLocation();
	const currentPath = location.pathname;
	const { t } = useTranslation();

	const isActive = (path: string) => {
		return currentPath === path;
	};

	const { size_text } = useSettings();

	return (
		<div
			className={`${BugerMenuStyles.menu} ${isOpen ? BugerMenuStyles.menuOpen : BugerMenuStyles.menuClosed}`}
		>
			<div className={BugerMenuStyles.div}>
				<button onClick={onClose} className={BugerMenuStyles.closeButton}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={BugerMenuStyles.closeButton}
						fill="none"
						viewBox="0 0 24 24"
						stroke="#00BABC"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={3}
							d="M6 18L18 6M6 6l12 12"
							filter="url(#closeShadow)"
						/>
					</svg>
				</button>
			</div>
			<nav className={BugerMenuStyles.navigation}>
				<ul className={BugerMenuStyles.navList}>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive('/') && <div className={`${BugerMenuStyles.indicator}`}></div>}
						<Link to="/" className={`${BugerMenuStyles.navItem} ${getSizeTextStyle(size_text)}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive('/') ? '#00BABC' : '#9CA3AF'}
							>
								<defs>
									<filter id="homeShadow" x="-20%" y="-20%" width="140%" height="140%">
										<feDropShadow
											dx="1"
											dy="1"
											stdDeviation="2"
											floodOpacity="0.3"
											floodColor="#000"
										/>
									</filter>
								</defs>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									filter="url(#homeShadow)"
								/>
							</svg>
							<span className={isActive('/') ? 'text-gray-900 font-medium' : 'text-gray-500'}>
								{t('menu.home')}
							</span>
						</Link>
					</li>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive('/profile') && <div className={`${BugerMenuStyles.indicator}`}></div>}
						<Link to="/profile" className={`${BugerMenuStyles.navItem}  ${getSizeTextStyle(size_text)}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive('/profile') ? '#00BABC' : '#9CA3AF'}
							>
								<defs>
									<filter id="profileShadow" x="-20%" y="-20%" width="140%" height="140%">
										<feDropShadow
											dx="1"
											dy="1"
											stdDeviation="2"
											floodOpacity="0.3"
											floodColor="#000"
										/>
									</filter>
								</defs>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									filter="url(#profileShadow)"
								/>
							</svg>
							<span
								className={isActive('/profile') ? 'text-gray-900 font-medium' : 'text-gray-500'}
							>
								{t('menu.profile')}
							</span>
						</Link>
					</li>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive('/game') && <div className={`${BugerMenuStyles.indicator}`}></div>}
						<Link to="/game" className={`${BugerMenuStyles.navItem}  ${getSizeTextStyle(size_text)}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive('/game') ? '#00BABC' : '#9CA3AF'}
							>
								<defs>
									<filter id="gameShadow" x="-20%" y="-20%" width="140%" height="140%">
										<feDropShadow
											dx="1"
											dy="1"
											stdDeviation="2"
											floodOpacity="0.3"
											floodColor="#000"
										/>
									</filter>
								</defs>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
									filter="url(#gameShadow)"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									filter="url(#gameShadow)"
								/>
							</svg>
							<span className={isActive('/game') ? 'text-gray-900 font-medium' : 'text-gray-500'}>
								{t('menu.game')}
							</span>
						</Link>
					</li>
					<li className="relative">
						<Link to="/logout" className={`${BugerMenuStyles.logoutButton}  ${getSizeTextStyle(size_text)}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke="#FF0000"
							>
								<defs>
									<filter id="logoutShadow" x="-20%" y="-20%" width="140%" height="140%">
										<feDropShadow
											dx="1"
											dy="1"
											stdDeviation="2"
											floodOpacity="0.3"
											floodColor="#000"
										/>
									</filter>
								</defs>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									filter="url(#logoutShadow)"
								/>
							</svg>
							<span>{t('menu.logout')}</span>
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default BurgerMenu;
