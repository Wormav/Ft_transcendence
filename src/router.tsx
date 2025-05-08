import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home';
import Layout from './components/layout/Layout.tsx';
import Profile from './pages/Profile/Profile.tsx';
import Game from './pages/Game/Game.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <Home />,
				children: [],
			},
			{
				path: '/profile',
				element: <Profile />,
				children: [],
			},
			{
				path: '/game',
				element: <Game/>,
				children: [],
			},
			{
				path: '/logout',
				element: <div>Logout Page</div>,
				children: [],
			},
		],
	},
]);

export default router;
