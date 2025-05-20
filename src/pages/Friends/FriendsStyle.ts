const FriendsStyle = {
	container: "container mx-auto py-4 sm:py-8 px-2 sm:px-4 max-w-4xl",
	title: "font-bold mb-4 sm:mb-8 text-center text-primary",
	tabContainer: "flex mb-4 sm:mb-6 border-b",
	tabActive: "text-primary border-b-2 border-primary",
	tabInactive: "text-gray-600 hover:text-gray-900 cursor-pointer",
	tabButton:
		"py-2 sm:py-3 px-3 sm:px-6 font-medium flex-1 text-center sm:text-base",
	tabCounter: "ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5",
	tabNotification: "ml-2 bg-red-500 text-white rounded-full px-2 py-0.5",
	contentContainer: "bg-white rounded-lg shadow-lg p-2 sm:p-4",
	emptyContainer:
		"flex flex-col items-center justify-center py-6 sm:py-12 text-gray-500",
	emptyIcon: "h-12 w-12 sm:h-16 sm:w-16 mb-4",
	emptyText: "text-base text-center",
	list: "divide-y divide-gray-200",
	listItem:
		"py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 p-2 rounded-md",
	profileSection: "flex items-center cursor-pointer mb-2 sm:mb-0",
	avatar: "h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-gray-200",
	avatarImg: "h-full w-full object-cover",
	infoContainer: "ml-4",
	username: "text-base font-medium text-gray-900",
	statusContainer: "flex items-center",
	onlineIndicator: "w-2 h-2 rounded-full mr-2 bg-green-500",
	offlineIndicator: "w-2 h-2 rounded-full mr-2 bg-gray-400",
	statusText: "text-gray-500",
	requestText: "text-gray-500",
	buttonContainer:
		"flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mt-2 sm:mt-0 w-full sm:w-auto",
	removeButton:
		"px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer w-full sm:w-auto",
	acceptButton:
		"px-3 py-1 bg-primary text-white rounded-md hover:bg-green-700 cursor-pointer w-full sm:w-auto",
	declineButton:
		"px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer w-full sm:w-auto",
	disabledButton: "opacity-50 cursor-not-allowed cursor-pointer",
};

export default FriendsStyle;
