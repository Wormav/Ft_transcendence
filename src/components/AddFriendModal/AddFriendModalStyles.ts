const AddFriendModalStyles = {
    overlay: 'fixed inset-0 bg-background/80 backdrop-blur flex items-center justify-center z-[999999] min-h-screen min-w-screen',
    modal: 'fixed inset-0 bg-background md:relative md:inset-auto md:rounded-lg p-6 w-full h-full md:w-[80vw] md:h-[80vh] shadow-lg',
    closeButton: 'absolute top-4 right-4 text-primary h-8 w-8 z-[999999] hover:text-primary cursor-pointer',
    title: 'text-2xl font-bold mb-6 text-center text-primary',
    searchContainer: 'relative flex items-center mb-6',
    searchInput: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BABC] focus:border-transparent',
    searchButton: 'absolute right-2 text-gray-500 hover:text-[#00BABC]',
    results: 'max-h-60 overflow-y-auto'
};

export default AddFriendModalStyles;
