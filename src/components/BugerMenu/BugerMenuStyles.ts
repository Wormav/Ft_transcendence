export const BugerMenuStyles = {
	container: 'min-h-screen w-full flex flex-col bg-background lg:hidden',
	menu: 'fixed top-0 left-0 h-full w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out z-50',
	menuOpen: 'translate-x-0',
	menuClosed: '-translate-x-full',
	closeButton: 'text-primary h-8 w-8',
	navigation: 'mt-4',
	navList: 'space-y-4',
	navItem: 'flex items-center px-6 py-2 text-gray-700 hover:text-primary',
	navIcon: 'h-8 w-8 mr-4',
	logoutButton: 'flex items-center px-6 py-2 text-red hover:text-red-600',
	indicator: 'absolute top-3 left-0 h-7 w-1 bg-primary rounded-r-md',
	li: 'relative font-primary',
	logout: 'text-red-500',
	div: 'flex justify-end p-4',
	svg: 'h-8 w-8',
};

export default BugerMenuStyles;
