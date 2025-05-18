export const MenuStyles = {
	menu: "hidden lg:flex flex-col h-screen w-60 3xl:w-80 bg-background shadow-lg fixed left-0 top-0",
	navigation: "flex flex-col flex-grow pt-16",
	navList: "flex flex-col space-y-2 p-4",
	li: "relative flex items-center",
	navItem:
		"flex items-center py-3 px-4 w-full rounded-lg hover:bg-gray-100 transition-colors duration-200",
	navIcon: "w-6 h-6 3xl:w-10 3xl:h-10 mr-3",
	indicator: "absolute left-0 w-2 h-8 bg-primary rounded-r-lg -ml-4",
	logoutButton:
		"flex items-center py-3 px-4 w-full text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200",
	logo: "h-12 w-12 3xl:h-24 3xl:w-24",
	logoContainer: "pt-8 pl-8",
};

export default MenuStyles;
