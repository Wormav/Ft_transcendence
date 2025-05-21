const styles = {
	container:
		"flex flex-col items-center justify-start w-full max-w-5xl mx-auto p-4 pt-20 min-h-screen",
	title: "text-3xl font-bold mb-8 text-center text-primary",
	tournamentInfo:
		"bg-slate-100 p-6 rounded-lg w-full mb-8 shadow-md border-l-4 border-primary",
	tournamentId: "font-bold text-lg mb-2 text-primary",
	labelText: "font-semibold text-primary",
	bracketContainer: "w-full overflow-x-auto mb-6 pb-4",
	bracketTree: "flex justify-start items-stretch gap-12 min-w-max p-6",
	roundContainer: "flex flex-col gap-6 min-w-[280px]",
	roundTitle:
		"text-center font-bold mb-6 text-primary py-2 border-b-2 border-primary",
	roundMatches: "flex flex-col gap-12 relative",
	connectorsContainer:
		"absolute top-0 left-full h-full w-16 pointer-events-none",
	connector: "absolute w-16 border-t-2 border-primary",
	connectorVertical: "absolute h-full w-0 border-r-2 border-primary",
	matches: "grid grid-cols-1 gap-4 w-full hidden",
	matchCard:
		"bg-white p-5 rounded-lg shadow-md flex flex-col border-l-3 border-primary transition-all hover:shadow-xl hover:translate-x-1",
	matchId:
		"font-medium mb-3 text-gray-700 dark:text-gray-300 flex items-center justify-between",
	matchStatus:
		"text-xs px-2 py-1 rounded-full bg-primary text-white inline-block",
	players: "mb-3 space-y-2",
	playerRow: "flex items-center justify-between",
	playerName: "font-medium",
	currentPlayer: "text-primary font-bold",
	winner:
		"text-primary font-semibold border-t border-gray-200 dark:border-gray-600 pt-2 mt-2",
	score:
		"font-bold text-lg bg-slate-100  px-2 py-1 rounded text-center min-w-[30px]",
	scoreHighlight:
		"font-bold text-lg bg-primary bg-opacity-20 px-2 py-1 rounded text-center text-primary min-w-[30px]",
	copyButton:
		"bg-primary hover:bg-opacity-80 text-white py-1 px-3 rounded-md mt-3 self-start transition flex items-center gap-1",
	button:
		"bg-primary hover:bg-opacity-80 text-white py-2 px-6 rounded-md mt-6 transition font-medium",
	error: "text-red-500 dark:text-red-400 text-center mb-4",
	noMatches: "text-center text-gray-600 dark:text-gray-300 py-8",
};

export default styles;
