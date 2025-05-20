const YourPictureCardStyle = {
	container: "space-y-4",
	avatarContainer: "relative flex justify-center items-center",
	avatar: "w-32 h-32 rounded-full object-cover border-4 border-primary",
	editButton:
		"absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer",
	uploadButton:
		"px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 w-full",
	fileInput: "hidden",
	errorMessage: "text-red-500 text-xs mt-1",
	buttonContainer:
		"flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-4 sm:space-y-0 mt-3 gap-4",
	cancelButton:
		"px-4 py-3 bg-gray-200 rounded-md hover:bg-gray-300 order-2 sm:order-1 mb-1 sm:mb-0",
	saveButton:
		"px-4 py-3 bg-primary text-white rounded-md hover:opacity-90 order-1 sm:order-2",
	previewContainer: "flex justify-center items-center",
	previewImage: "w-40 h-40 rounded-full object-cover border-4 border-primary",
	inputContainer: "flex flex-col space-y-2",
	inputLabel: "font-medium text-gray-700",
	urlInput:
		"w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
	tabContainer: "flex flex-col sm:flex-row mb-4 border-b border-gray-200",
	tab: "px-4 py-3 cursor-pointer mb-1 sm:mb-0 border-b border-gray-200 sm:border-b-0 text-center",
	activeTab:
		"px-4 py-3 cursor-pointer mb-1 sm:mb-0 border-l-4 sm:border-l-0 border-b-2 border-primary text-primary font-semibold text-center",
	orSeparator: "flex items-center my-4",
	separatorLine: "flex-grow border-t border-gray-300",
	separatorText: "px-3 text-gray-500 text-sm",
};

export default YourPictureCardStyle;
