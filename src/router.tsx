import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./components/layout/Layout.tsx";
import Game from "./pages/Game/Game.tsx";
import Pong from "./pages/Pong/Pong.tsx";
import Signup from "./pages/Signup/Signup.tsx";
import Login from "./pages/Login/Login.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import ProfileFriend from "./pages/ProfileFriend/ProfileFriend.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Tournaments from "./pages/Tournaments/Tournaments.tsx";
import TournamentBracket from "./pages/Tournaments/TournamentBracket.tsx";
import Friends from "./pages/Friends/Friends.tsx";

import NotFound from "./pages/NotFound/NotFound";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Home />,
				children: [],
			},
			{
				path: "*",
				element: <NotFound />,
			},
			{
				path: "/settings",
				element: <Settings />,
				children: [],
			},
			{
				path: "/game",
				element: <Game />,
				children: [],
			},
			{
				path: "/profile",
				element: <Profile />,
				children: [],
			},
			{
				path: "/profile/:uuid",
				element: <ProfileFriend />,
				children: [],
			},
			{
				path: "/dashboard",
				element: <Dashboard />,
				children: [],
			},
			{
				path: "/tournaments",
				element: <Tournaments />,
				children: [],
			},
			{
				path: "/tournaments/:id",
				element: <TournamentBracket />,
				children: [],
			},
			{
				path: "/friends",
				element: <Friends />,
				children: [],
			},
		],
	},
	{
		path: "/pong",
		element: <Pong />,
		children: [],
	},
	{
		path: "/login",
		element: <Login />,
		children: [],
	},
	{
		path: "/signup",
		element: <Signup />,
		children: [],
	},
]);

export default router;
