import NavBarStyles from "./NavBarStyles";
import ButtonSettings from "../ButtonSettings/ButtonSettings";
import ButtonProfil from "../ButtonProfil/ButtonProfil";
import { useNavigate } from "react-router-dom";
import type { NavBarProps } from "../../types/NavBarProps";

const NavBar: React.FC<NavBarProps> = ({ onMenuClick }) => {
	const navigate = useNavigate();

	return (
		<header className={NavBarStyles.container}>
			<div className={NavBarStyles.content}>
				<div className={NavBarStyles.leftSection}>
					<button onClick={onMenuClick} className={NavBarStyles.menuButton}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={NavBarStyles.svg}
							fill="none"
							viewBox="0 0 24 24"
							stroke="#00BABC"
						>
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
				<div className={NavBarStyles.logoSection}>
					<img
						src="/42_Logo.svg.png"
						alt="42 Logo"
						className={NavBarStyles.logo}
					/>
				</div>
				<div className={NavBarStyles.containerBtn}>
					<ButtonSettings onClick={() => navigate("/settings")} />
					<ButtonProfil onClick={() => navigate("/profile")} />
				</div>
			</div>
		</header>
	);
};

export default NavBar;
