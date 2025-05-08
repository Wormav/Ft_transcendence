import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LayoutStyles from './LayoutStyles';
import BurgerMenu from '../BugerMenu/BurgerMenu';
import NavBar from '../NavBar/NavBar';
import Menu from '../Menu/Menu';
import globalStyle from '../../globalStyle';

const Layout: React.FC = () => {
	const [bugerOpen, setBugerOpen] = useState(false);

	const handleOpenMenu = () => {
		setBugerOpen(true);
	};

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
				<footer className="flex items-center justify-center my-6 lg:ml-60 3xl:ml-80">
					<p className={`${globalStyle.span} `}>
						ft_transcendence | ©2025 | aauberti | ebervas | jlorette | thomarna{' '}
					</p>
				</footer>
			</main>
		</div>
	);
};

export default Layout;
