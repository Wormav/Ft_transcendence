const AddFriendModalStyles = {
	modal:
		"relative bg-background rounded-lg p-6 w-[95vw] h-[90vh] md:w-[80vw] md:h-[80vh] max-w-4xl shadow-lg flex flex-col",
	closeButton:
		"absolute top-4 right-4 text-primary h-8 w-8 hover:text-primary cursor-pointer",
	title: "text-2xl font-bold mb-6 text-center text-primary",
	searchContainer: "relative flex items-center mb-6",
	searchInput:
		"w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BABC] focus:border-transparent",
	searchButton: "absolute right-2 text-gray-500 hover:text-[#00BABC]",
	results: "flex-1 overflow-y-auto border border-gray-200 rounded-lg p-2",
	userItem: "hover:bg-gray-50 transition-colors duration-200",
};

export default AddFriendModalStyles;
