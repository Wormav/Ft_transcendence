import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home';
import Layout from './components/layout/Layout.tsx';
import Profile from './pages/Profile/Profile.tsx';
import Game from './pages/Game/Game.tsx';
import Pong from './pages/Pong/Pong.tsx';
import Login from './pages/Login/Login.tsx';
import Signup from './pages/Signup/Signup.tsx';

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
		],

	},
	{
		path: '/pong',
		element: <Pong/>,
		children: [],
	},
	{
		path: '/login',
		element: <Login/>,
		children: [],
	},
	{
		path: '/signup',
		element: <Signup/>,
		children: [],
	},
]);

export default router;
