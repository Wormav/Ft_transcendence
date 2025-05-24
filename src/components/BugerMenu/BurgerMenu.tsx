import AddFriendModal from "../AddFriendModal/AddFriendModal";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BugerMenuStyles } from "./BugerMenuStyles";
import { useTranslation } from "../../context/TranslationContext";
import { useSettings } from "../../context/SettingsContext";
import { getSizeTextStyle } from "../../globalStyle";
import type { BurgerMenuProps } from "../../types/BurgerMenuProps";

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClose }) => {
	const location = useLocation();
	const currentPath = location.pathname;
	const { t } = useTranslation();
	const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);

	const isActive = (path: string) => {
		return currentPath === path;
	};

	const { size_text } = useSettings();

	return (
		<div
			className={`${BugerMenuStyles.menu} ${isOpen ? BugerMenuStyles.menuOpen : BugerMenuStyles.menuClosed}`}
		>
			<div className={BugerMenuStyles.div}>
				<button
					onClick={onClose}
					className={BugerMenuStyles.closeButton}
					aria-label={t("menu.close")}
				>
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
						<button
							onClick={() => setIsAddFriendModalOpen(true)}
							className={`${BugerMenuStyles.navItem} ${getSizeTextStyle(size_text)}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke="#9CA3AF"
							>
								<defs>
									<filter
										id="addFriendShadowBurger"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
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
									d="M12 4v16m8-8H4"
									filter="url(#addFriendShadowBurger)"
								/>
							</svg>
							<span className="text-gray-500">{t("menu.addFriend")}</span>
						</button>
					</li>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive("/") && (
							<div className={`${BugerMenuStyles.indicator}`}></div>
						)}
						<Link
							to="/"
							className={`${BugerMenuStyles.navItem} ${getSizeTextStyle(size_text)}`}
							onClick={onClose}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive("/") ? "#00BABC" : "#9CA3AF"}
							>
								<defs>
									<filter
										id="homeShadow"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
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
									isActive("/") ? "text-gray-900 font-medium" : "text-gray-500"
								}
							>
								{t("menu.home")}
							</span>
						</Link>
					</li>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive("/profile") && (
							<div className={`${BugerMenuStyles.indicator}`}></div>
						)}
						<Link
							to="/profile"
							className={`${BugerMenuStyles.navItem} ${getSizeTextStyle(size_text)}`}
							onClick={onClose}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive("/profile") ? "#00BABC" : "#9CA3AF"}
							>
								<defs>
									<filter
										id="profileShadow"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
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
									isActive("/profile")
										? "text-gray-900 font-medium"
										: "text-gray-500"
								}
							>
								{t("menu.profile")}
							</span>
						</Link>
					</li>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive("/dashboard") && (
							<div className={`${BugerMenuStyles.indicator}`}></div>
						)}
						<Link
							to="/dashboard"
							className={`${BugerMenuStyles.navItem} ${getSizeTextStyle(size_text)}`}
							onClick={onClose}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive("/dashboard") ? "#00BABC" : "#9CA3AF"}
							>
								<defs>
									<filter
										id="dashboardShadow"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
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
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									filter="url(#dashboardShadow)"
								/>
							</svg>
							<span
								className={
									isActive("/dashboard")
										? "text-gray-900 font-medium"
										: "text-gray-500"
								}
							>
								{t("menu.dashboard")}
							</span>
						</Link>
					</li>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive("/game") && (
							<div className={`${BugerMenuStyles.indicator}`}></div>
						)}
						<Link
							to="/game"
							className={`${BugerMenuStyles.navItem}  ${getSizeTextStyle(size_text)}`}
							onClick={onClose}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive("/game") ? "#00BABC" : "#9CA3AF"}
							>
								<defs>
									<filter
										id="gameShadow"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
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
									isActive("/game")
										? "text-gray-900 font-medium"
										: "text-gray-500"
								}
							>
								{t("menu.game")}
							</span>
						</Link>
					</li>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive("/friends") && (
							<div className={`${BugerMenuStyles.indicator}`}></div>
						)}
						<Link
							to="/friends"
							className={`${BugerMenuStyles.navItem}  ${getSizeTextStyle(size_text)}`}
							onClick={onClose}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive("/friends") ? "#00BABC" : "#9CA3AF"}
							>
								<defs>
									<filter
										id="friendsShadow"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
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
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									filter="url(#friendsShadow)"
								/>
							</svg>
							<span
								className={
									isActive("/friends")
										? "text-gray-900 font-medium"
										: "text-gray-500"
								}
							>
								{t("menu.friends")}
							</span>
						</Link>
					</li>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive("/tournaments") && (
							<div className={`${BugerMenuStyles.indicator}`}></div>
						)}
						<Link
							to="/tournaments"
							className={`${BugerMenuStyles.navItem} ${getSizeTextStyle(size_text)}`}
							onClick={onClose}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive("/tournaments") ? "#00BABC" : "#9CA3AF"}
							>
								<defs>
									<filter
										id="tournamentsShadow"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
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
									d="M5 5h14c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1h-1.5l-1.5 8h-8l-1.5-8H5c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1zm7 .5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"
									filter="url(#tournamentsShadow)"
								/>
							</svg>
							<span
								className={
									isActive("/tournaments")
										? "text-gray-900 font-medium"
										: "text-gray-500"
								}
							>
								{t("menu.tournaments")}
							</span>
						</Link>
					</li>
					<li className={`${BugerMenuStyles.li}`}>
						{isActive("/settings") && (
							<div className={`${BugerMenuStyles.indicator}`}></div>
						)}
						<Link
							to="/settings"
							className={`${BugerMenuStyles.navItem}  ${getSizeTextStyle(size_text)}`}
							onClick={onClose}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke={isActive("/settings") ? "#00BABC" : "#9CA3AF"}
							>
								<defs>
									<filter
										id="settingsShadow"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
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
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
									filter="url(#settingsShadow)"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									filter="url(#settingsShadow)"
								/>
							</svg>
							<span
								className={
									isActive("/settings")
										? "text-gray-900 font-medium"
										: "text-gray-500"
								}
							>
								{t("menu.settings")}
							</span>
						</Link>
					</li>
					<li className="relative">
						<Link
							to="/logout"
							className={`${BugerMenuStyles.logoutButton}  ${getSizeTextStyle(size_text)}`}
							onClick={onClose}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={BugerMenuStyles.navIcon}
								fill="none"
								viewBox="0 0 24 24"
								stroke="#FF0000"
							>
								<defs>
									<filter
										id="logoutShadow"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
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
							<span>{t("menu.logout")}</span>
						</Link>
					</li>
				</ul>
			</nav>
			<AddFriendModal
				isOpen={isAddFriendModalOpen}
				onClose={() => setIsAddFriendModalOpen(false)}
			/>
		</div>
	);
};

export default BurgerMenu;
