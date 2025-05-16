const TournamentsStyle = {
    container: 'w-full max-w-4xl mx-auto p-4 font-primary',
    title: 'text-2xl font-bold mb-6 text-center text-primary',
    form: 'space-y-4 mb-8 bg-white-custom rounded-xl p-6 shadow-lg',
    select: 'w-full p-2 bg-gray-200 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors hover:bg-gray-100',
    playerInput: 'w-full p-2 bg-gray-200 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors hover:bg-gray-100',
    button: 'w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02]',
    buttonDisabled: 'w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed shadow-md opacity-70',
    tournament: {
        container: 'mt-8 bg-white p-6 rounded-xl shadow-lg',
        roundTitle: 'text-xl font-semibold mb-4 text-primary',
        bracket: 'flex lg:flex-row flex-col lg:justify-center items-center gap-8 mt-4',
        round: 'flex flex-col justify-around h-full w-full lg:w-auto',
        match: 'relative border border-gray p-4 rounded-xl mb-4 flex flex-col w-full lg:w-[200px] bg-white shadow-md hover:shadow-lg transition-shadow',
        player: 'py-2 px-3 border-b border-gray last:border-b-0 transition-colors',
        winner: 'bg-primary/10 text-primary',
        vs: 'text-xs text-gray absolute -right-6 top-1/2 -translate-y-1/2',
        matchId: 'mt-2 flex items-center justify-between text-sm text-gray pt-2 border-t border-gray',
        copyButton: 'ml-2 p-1 hover:bg-gray-200 rounded-md cursor-pointer text-primary transition-colors',
    },
    error: 'text-red-custom text-sm mt-1',
};

export default TournamentsStyle;
