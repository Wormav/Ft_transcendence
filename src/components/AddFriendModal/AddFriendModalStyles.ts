const AddFriendModalStyles = {
	overlay: "fixed inset-0 isolate",
	overlayInner:
		"fixed inset-0 bg-black/25 backdrop-blur flex items-center justify-center min-h-screen min-w-screen overflow-hidden",
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
	userItem:
		"hover:bg-gray-50 transition-colors duration-200 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2",
	userInfo: "flex items-center",
	userAvatar:
		"h-10 w-10 rounded-full overflow-hidden bg-gray-200 cursor-pointer",
	userAvatarImg: "h-full w-full object-cover",
	userName: "ml-3 cursor-pointer",
	userNameText: "text-sm font-medium text-gray-900",
	actionButtons:
		"flex justify-start sm:justify-end mt-2 sm:mt-0 w-full sm:w-auto",
	resultsList: "divide-y divide-gray-200",
	messageContainer: "text-center py-4",
	errorMessage: "text-red-500 text-center py-4",
	removeFriendButton:
		"w-full sm:w-auto px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700",
	pendingButton:
		"w-full sm:w-auto px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600",
	acceptButton:
		"w-full sm:w-auto px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700",
	addFriendButton:
		"w-full sm:w-auto px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700",
};

export default AddFriendModalStyles;
