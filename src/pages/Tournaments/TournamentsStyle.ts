const TournamentsStyle = {
    container: 'w-full max-w-4xl mx-auto p-4',
    title: 'text-2xl font-bold mb-6 text-center',
    form: 'space-y-4 mb-8',
    select: 'w-full p-2 border rounded-md',
    playerInput: 'w-full p-2 border rounded-md',
    button: 'w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors',
    buttonDisabled: 'w-full bg-gray-400 text-white p-2 rounded-md cursor-not-allowed',
    tournament: {
        container: 'mt-8',
        roundTitle: 'text-xl font-semibold mb-4',
        bracket: 'flex justify-center gap-8 mt-4',
        round: 'flex flex-col justify-around h-full',
        match: 'relative border p-4 rounded-md mb-4 flex flex-col min-w-[200px] bg-white',
        matchConnector: 'absolute w-8 border-t border-gray-300',
        player: 'py-2 px-3 border-b last:border-b-0',
        winner: 'bg-green-100',
        vs: 'text-xs text-gray-500 absolute -right-6 top-1/2 -translate-y-1/2',
        matchId: 'mt-2 flex items-center justify-between text-sm text-gray-500 pt-2 border-t',
        copyButton: 'ml-2 p-1 hover:bg-gray-100 rounded cursor-pointer',
    },
    error: 'text-red-500 text-sm mt-1',
};

export default TournamentsStyle;
