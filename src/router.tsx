import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home';
import Layout from './components/layout/Layout.tsx';
import Profile from './pages/Profile/Profile.tsx';
import Game from './pages/Game/Game.tsx';
import Pong from './components/Pong/Pong.tsx';

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
				path: '/pong',
				element: <Pong/>,
				children: [],
			},
		],
	},
]);

export default router;
