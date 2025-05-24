import BurgerMenu from "../BugerMenu/BurgerMenu";
import NavBar from "../NavBar/NavBar";
import Menu from "../Menu/Menu";
import LayoutStyles from "./LayoutStyles";
import globalStyle, { getSizeTextStyle } from "../../globalStyle";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

const Layout: React.FC = () => {
	const [bugerOpen, setBugerOpen] = useState(false);
	const { size_text } = useSettings();

	const handleOpenMenu = () => {
		setBugerOpen(true);
	};

	useEffect(() => {}, [size_text]);

	return (
		<div className={`layout ${LayoutStyles.container}`}>
			<NavBar onMenuClick={handleOpenMenu} />
			<main className={LayoutStyles.contentWrapper}>
				<BurgerMenu isOpen={bugerOpen} onClose={() => setBugerOpen(false)} />
				{bugerOpen && <div className={LayoutStyles.overlay}></div>}
				<Menu />
				<div className={LayoutStyles.outletDiv}>
					<Outlet />
				</div>
				<div className={globalStyle.footer}>
					<footer className="flex items-center justify-center lg:ml-60 3xl:ml-80">
						<p
							className={`${globalStyle.span} ${getSizeTextStyle(size_text)} text-center`}
						>
							ft_transcendence | ©2025 | aauberti | ebervas | jlorette |
							thomarna{" "}
						</p>
					</footer>
				</div>
			</main>
		</div>
	);
};

export default Layout;
