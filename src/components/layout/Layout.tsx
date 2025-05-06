import React from 'react';
import { Outlet } from 'react-router-dom';
import LayoutStyles from './LayoutStyles';

const Layout: React.FC = () => {
	return (
		<div className={`layout ${LayoutStyles.container}`}>
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
