const TournamentsStyle = {
	container: "w-full max-w-4xl mx-auto p-4 font-primary",
	title: "text-2xl font-bold mb-6 text-center text-primary",
	subtitle: "text-xl font-semibold mb-4 text-primary",
	form: "space-y-4 mb-8 bg-white-custom rounded-xl p-6 shadow-lg",
	select:
		"w-full p-2 bg-gray-200 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors hover:bg-gray-100",
	playerInput:
		"w-full p-2 bg-gray-200 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors hover:bg-gray-100",
	button:
		"w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02]",
	buttonDisabled:
		"w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed shadow-md opacity-70",
	activeTournament:
		"mb-8 bg-white-custom p-6 rounded-xl shadow-lg border-2 border-primary",
	tournamentActiveItem:
		"border border-primary rounded-lg p-4 mb-4 bg-white hover:shadow-lg transition-shadow cursor-pointer relative",
	tournamentId: "font-bold text-lg mb-2 text-primary",
	labelText: "font-medium text-gray-700",
	statusActive: "mt-2 font-bold text-green-600",
	viewBracket: "text-primary/80 italic mt-3 text-sm text-right",
	tournamentList: "mt-8 bg-white-custom p-4 md:p-6 rounded-xl shadow-lg",
	tournamentItem:
		"border border-gray-300 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow bg-white",
	tabContainer:
		"flex flex-col md:flex-row border-b border-gray-300 mb-6 gap-2 md:gap-0",
	tab: "py-3 md:py-2 px-6 text-gray-600 cursor-pointer transition-all hover:bg-gray-100 border border-gray-200 md:border-b-0 rounded-md md:rounded-t-md md:rounded-b-none w-full md:w-auto text-center",
	activeTab:
		"py-3 md:py-2 px-6 text-primary font-medium border-2 border-primary md:border-b-0 cursor-pointer transition-all rounded-md md:rounded-t-md md:rounded-b-none bg-gray-100 w-full md:w-auto text-center",
	noTournaments: "text-gray-500 text-center py-8 italic",
	tournament: {
		container: "mt-8 bg-white p-6 rounded-xl shadow-lg",
		roundTitle: "text-xl font-semibold mb-4 text-primary",
		bracket:
			"flex lg:flex-row flex-col lg:justify-center items-center gap-8 mt-4",
		round: "flex flex-col justify-around h-full w-full lg:w-auto",
		match:
			"relative border border-gray p-4 rounded-xl mb-4 flex flex-col w-full lg:w-[200px] bg-white shadow-md hover:shadow-lg transition-shadow",
		player: "py-2 px-3 border-b border-gray last:border-b-0 transition-colors",
		winner: "bg-primary/10 text-primary",
		vs: "text-xs text-gray absolute -right-6 top-1/2 -translate-y-1/2",
		matchId:
			"mt-2 flex items-center justify-between text-sm text-gray pt-2 border-t border-gray",
		copyButton:
			"ml-2 p-1 hover:bg-gray-200 rounded-md cursor-pointer text-primary transition-colors",
	},
	error: "text-red-custom text-sm mt-1",
};

export default TournamentsStyle;
