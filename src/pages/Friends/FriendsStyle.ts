const FriendsStyle = {
	container: "container mx-auto py-8 px-4 max-w-4xl",
	title: "font-bold mb-8 text-center text-primary",
	tabContainer: "flex mb-6 border-b",
	tabActive: "text-primary border-b-2 border-primary",
	tabInactive: "text-gray-600 hover:text-gray-900 cursor-pointer",
	tabButton: "py-3 px-6 font-medium flex-1 text-center",
	tabCounter: "ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs",
	tabNotification:
		"ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs",
	contentContainer: "bg-white rounded-lg shadow-lg p-4",
	emptyContainer:
		"flex flex-col items-center justify-center py-12 text-gray-500",
	emptyIcon: "h-16 w-16 mb-4",
	emptyText: "text-lg",
	list: "divide-y divide-gray-200",
	listItem:
		"py-4 flex items-center justify-between hover:bg-gray-50 p-2 rounded-md",
	profileSection: "flex items-center cursor-pointer",
	avatar: "h-12 w-12 rounded-full overflow-hidden bg-gray-200",
	avatarImg: "h-full w-full object-cover",
	infoContainer: "ml-4",
	username: "text-lg font-medium text-gray-900",
	statusContainer: "flex items-center text-sm",
	onlineIndicator: "w-2 h-2 rounded-full mr-2 bg-green-500",
	offlineIndicator: "w-2 h-2 rounded-full mr-2 bg-gray-400",
	statusText: "text-gray-500",
	requestText: "text-sm text-gray-500",
	buttonContainer: "flex space-x-2",
	removeButton:
		"px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer",
	acceptButton:
		"px-3 py-1 bg-primary text-white  rounded-md hover:bg-green-700 cursor-pointer",
	declineButton:
		"px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 cursor-pointer",
	disabledButton: "opacity-50 cursor-not-allowed cursor-pointer",
};

export default FriendsStyle;
