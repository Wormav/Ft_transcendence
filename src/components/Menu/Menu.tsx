import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuStyles from './MenuStyles';
import { useTranslation } from '../../context/TranslationContext';

const Menu: React.FC = () => {
	const location = useLocation();
	const currentPath = location.pathname;
	const { t } = useTranslation();

	const isActive = (path: string) => {
		return currentPath === path;
	};

	return (
		<div className={MenuStyles.menu}>
			<div className={MenuStyles.logoContainer}>
				<img src="/42_Logo.svg.png" alt="42 Logo" className={MenuStyles.logo} />
			</div>
			<nav className={MenuStyles.navigation}>
				<ul className={MenuStyles.navList}>
					<li className={`${MenuStyles.li}`}>
						{isActive('/') && <div className={`${MenuStyles.indicator}`}></div>}
						<Link to="/" className={`${MenuStyles.navItem} pl-4`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={MenuStyles.navIcon}
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
							<span
								className={
									isActive('/')
										? 'text-gray-900 font-medium 3xl:text-2xl'
										: 'text-gray-500 3xl:text-2xl'
								}
							>
								{t('menu.home')}
							</span>
						</Link>
					</li>
					<li className={`${MenuStyles.li}`}>
						{isActive('/profile') && <div className={`${MenuStyles.indicator}`}></div>}
						<Link to="/profile" className={`${MenuStyles.navItem} pl-4`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={MenuStyles.navIcon}
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
								className={
									isActive('/profile')
										? 'text-gray-900 font-medium 3xl:text-2xl'
										: 'text-gray-500 3xl:text-2xl'
								}
							>
								{t('menu.profile')}
							</span>
						</Link>
					</li>
					<li className={`${MenuStyles.li}`}>
						{isActive('/game') && <div className={`${MenuStyles.indicator}`}></div>}
						<Link to="/game" className={`${MenuStyles.navItem} pl-4`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={MenuStyles.navIcon}
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
							<span
								className={
									isActive('/game')
										? 'text-gray-900 font-medium 3xl:text-2xl'
										: 'text-gray-500 3xl:text-2xl'
								}
							>
								{t('menu.game')}
							</span>
						</Link>
					</li>
					<li className="relative">
						<Link to="/logout" className={`${MenuStyles.logoutButton} pl-4`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={MenuStyles.navIcon}
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
							<span className="3xl:text-2xl">{t('menu.logout')}</span>
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Menu;
