import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home';
import Layout from './components/Layout/Layout.tsx';

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
				element: <div>Profile Page</div>,
				children: [],
			},
			{
				path: '/game',
				element: <div>Game Page</div>,
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
