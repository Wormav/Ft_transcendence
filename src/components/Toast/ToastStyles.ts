export const ToastStyles = {
	toast: `fixed bottom-5 right-5 flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow z-toast
          transition-opacity duration-300`,
	visible: "opacity-100",
	hidden: "opacity-0",
	success: "text-green-800 bg-green-100 dark:bg-green-800 dark:text-green-100",
	error: "text-red-800 bg-red-100 dark:bg-red-800 dark:text-red-100",
	info: "text-blue-800 bg-blue-100 dark:bg-blue-800 dark:text-blue-100",
	iconContainer:
		"inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg",
	messageContainer: "ml-3 text-sm font-normal",
	closeButton: `ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5
                inline-flex h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700`,
};
