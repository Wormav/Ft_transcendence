import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LayoutStyles from './LayoutStyles';
import BurgerMenu from '../BugerMenu/BurgerMenu';
import NavBar from '../NavBar/NavBar';
import Menu from '../Menu/Menu';

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
			</main>
		</div>
	);
};

export default Layout;
