export const BugerMenuStyles = {
  container: "min-h-screen w-full flex flex-col bg-background font-sans",
  menu: "fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
  menuOpen: "translate-x-0",
  menuClosed: "-translate-x-full",
  closeButton: "text-primary",
  navigation: "mt-4",
  navList: "space-y-4",
  navItem: "flex items-center px-6 py-2 text-gray-700 hover:text-primary",
  navIcon: "h-5 w-5 mr-3",
  logoutButton: "flex items-center px-6 py-2 text-red hover:text-red-600",
  indicator: "absolute top-2 left-0 h-6 w-1 bg-[#00BABC] rounded-r-md",
  li: "relative",
	logout: "text-red-500",
  div: "flex justify-end p-4"

};

export default BugerMenuStyles;
