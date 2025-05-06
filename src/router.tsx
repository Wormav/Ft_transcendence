import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Home />,
				children: []
			}
		]
	}
])

export default router;
