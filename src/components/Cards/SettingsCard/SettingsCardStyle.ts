const SettingsCardStyle = {
	container: "space-y-4",
	input: "w-full p-2 border border-gray-300 rounded-md",
	errorMessage: "text-red-500 text-xs mt-1",
	buttonContainer:
		"flex flex-col sm:flex-row gap-2 justify-end sm:space-x-2 space-y-3 sm:space-y-0",
	cancelButton:
		"px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 order-2 sm:order-1",
	saveButton:
		"px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 order-1 sm:order-2",
	editButton:
		"flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer",
};

export default SettingsCardStyle;
