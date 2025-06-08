// Données de démo pour le mode demo
import type { UserData } from "../types/UserContextType";
import type { FriendData } from "../types/FriendContextType";
import type { MatchData } from "../types/GameContextType";
import type { Tournament } from "../types/Tournament";
import type { FriendProfile } from "../types/FriendProfile";

// Utilisateur démo principal
export const DEMO_USER: UserData = {
	uuid: "demo-user-123",
	email: "demo@transcendence.com",
	username: "DemoPlayer",
	avatar: "/default.png",
	color_items: "#3B82F6",
	color_bg: "#1F2937",
	size_text: 16,
	speed_moves: "normal",
	last_seen: Date.now(),
};

// Profils d'amis démo
export const DEMO_FRIENDS: FriendProfile[] = [
	{
		uuid: "friend-1",
		username: "PlayerOne",
		email: "player1@demo.com",
		avatar: "/default.png",
		status: "online",
		last_seen: Date.now() - 60000, // 1 minute ago
	},
	{
		uuid: "friend-2",
		username: "GameMaster",
		email: "gamemaster@demo.com",
		avatar: "/default.png",
		status: "offline",
		last_seen: Date.now() - 3600000, // 1 hour ago
	},
	{
		uuid: "friend-3",
		username: "PongChamp",
		email: "pongchamp@demo.com",
		avatar: "/default.png",
		status: "online",
		last_seen: Date.now() - 30000, // 30 seconds ago
	},
];

// Données d'amis pour le contexte
export const DEMO_FRIEND_DATA: FriendData = {
	friends: [
		{
			id: 1,
			requester_uuid: "demo-user-123",
			target_uuid: "friend-1",
			status: "accepted",
			created_at: Date.now() - 86400000, // 1 day ago
		},
		{
			id: 2,
			requester_uuid: "friend-2",
			target_uuid: "demo-user-123",
			status: "accepted",
			created_at: Date.now() - 172800000, // 2 days ago
		},
		{
			id: 3,
			requester_uuid: "demo-user-123",
			target_uuid: "friend-3",
			status: "accepted",
			created_at: Date.now() - 259200000, // 3 days ago
		},
	],
	requests_received: [
		{
			id: 4,
			requester_uuid: "friend-4",
			target_uuid: "demo-user-123",
			status: "pending",
			created_at: Date.now() - 43200000, // 12 hours ago
		},
	],
	requests_sent: [],
};

// Matchs démo
export const DEMO_MATCHES: MatchData[] = [
	{
		uuid: "match-1",
		player: "demo-user-123",
		guest: "friend-1",
		guest2: null,
		score1: 11,
		score2: 8,
		starttime: new Date(Date.now() - 86400000).toISOString(),
		endtime: new Date(Date.now() - 86400000 + 300000).toISOString(),
		finished: 1,
		tournament: null,
	},
	{
		uuid: "match-2",
		player: "demo-user-123",
		guest: "Guest",
		guest2: null,
		score1: 11,
		score2: 5,
		starttime: new Date(Date.now() - 172800000).toISOString(),
		endtime: new Date(Date.now() - 172800000 + 240000).toISOString(),
		finished: 1,
		tournament: null,
	},
	{
		uuid: "match-3",
		player: "friend-2",
		guest: "demo-user-123",
		guest2: null,
		score1: 7,
		score2: 11,
		starttime: new Date(Date.now() - 259200000).toISOString(),
		endtime: new Date(Date.now() - 259200000 + 360000).toISOString(),
		finished: 1,
		tournament: null,
	},
	{
		uuid: "match-4",
		player: "demo-user-123",
		guest: "friend-3",
		guest2: null,
		score1: 11,
		score2: 9,
		starttime: new Date(Date.now() - 345600000).toISOString(),
		endtime: new Date(Date.now() - 345600000 + 420000).toISOString(),
		finished: 1,
		tournament: null,
	},
	{
		uuid: "match-5",
		player: "demo-user-123",
		guest: "Guest",
		guest2: null,
		score1: 6,
		score2: 11,
		starttime: new Date(Date.now() - 432000000).toISOString(),
		endtime: new Date(Date.now() - 432000000 + 300000).toISOString(),
		finished: 1,
		tournament: null,
	},
];

// Tournois démo
export const DEMO_TOURNAMENTS: Tournament[] = [
	{
		uuid: "tournament-1",
		host: "demo-user-123",
		players: ["demo-user-123", "friend-1", "friend-2", "friend-3"],
		match: [
			{ uuid: "match-t1-1", round: 1, player1: "demo-user-123", player2: "friend-1", winner: "demo-user-123", finished: 1 },
			{ uuid: "match-t1-2", round: 1, player1: "friend-2", player2: "friend-3", winner: "friend-2", finished: 1 },
			{ uuid: "match-t1-3", round: 2, player1: "demo-user-123", player2: "friend-2", winner: "demo-user-123", finished: 1 },
		],
		winner: "demo-user-123",
		finished: 1,
	},
	{
		uuid: "tournament-2",
		host: "friend-1",
		players: ["demo-user-123", "friend-1", "friend-2", "friend-3"],
		match: [
			{ uuid: "match-t2-1", round: 1, player1: "demo-user-123", player2: "friend-3", finished: 0 },
			{ uuid: "match-t2-2", round: 1, player1: "friend-1", player2: "friend-2", finished: 0 },
		],
		winner: null,
		finished: 0,
	},
];

// Matchs de tournoi démo
export const DEMO_TOURNAMENT_MATCHES: { [key: string]: any } = {
	"match-t1-1": {
		uuid: "match-t1-1",
		player: "demo-user-123",
		guest: "friend-1",
		score1: 11,
		score2: 7,
		finished: 1,
		tournament: "tournament-1",
	},
	"match-t1-2": {
		uuid: "match-t1-2",
		player: "friend-2",
		guest: "friend-3",
		score1: 11,
		score2: 6,
		finished: 1,
		tournament: "tournament-1",
	},
	"match-t1-3": {
		uuid: "match-t1-3",
		player: "demo-user-123",
		guest: "friend-2",
		score1: 11,
		score2: 9,
		finished: 1,
		tournament: "tournament-1",
	},
	"match-t2-1": {
		uuid: "match-t2-1",
		player: "demo-user-123",
		guest: "friend-3",
		score1: 8,
		score2: 5,
		finished: 0,
		tournament: "tournament-2",
	},
	"match-t2-2": {
		uuid: "match-t2-2",
		player: "friend-1",
		guest: "friend-2",
		score1: 0,
		score2: 0,
		finished: 0,
		tournament: "tournament-2",
	},
};

// Utilisateurs disponibles pour recherche
export const DEMO_SEARCH_USERS = [
	{
		uuid: "friend-4",
		username: "NewPlayer",
		avatar: "/default.png",
	},
	{
		uuid: "friend-5",
		username: "ProGamer",
		avatar: "/default.png",
	},
	{
		uuid: "friend-6",
		username: "CasualPlayer",
		avatar: "/default.png",
	},
];

// Helper pour obtenir un profil d'ami par UUID
export const getFriendProfileByUuid = (uuid: string): FriendProfile | null => {
	const friend = DEMO_FRIENDS.find(f => f.uuid === uuid);
	if (friend) return friend;

	// Chercher dans les utilisateurs de recherche
	const searchUser = DEMO_SEARCH_USERS.find(u => u.uuid === uuid);
	if (searchUser) {
		return {
			...searchUser,
			email: `${searchUser.username.toLowerCase()}@demo.com`,
			status: "offline",
			last_seen: Date.now() - 7200000, // 2 hours ago
		};
	}

	return null;
};

// Helper pour obtenir les matchs d'un utilisateur
export const getMatchesByUuid = (uuid: string): MatchData[] => {
	if (uuid === "demo-user-123") {
		return DEMO_MATCHES;
	}

	// Retourner quelques matchs fictifs pour les autres utilisateurs
	return DEMO_MATCHES.slice(0, 2).map(match => ({
		...match,
		uuid: `${uuid}-match-${Math.random()}`,
		player: uuid,
		guest: "demo-user-123",
		score1: Math.floor(Math.random() * 11) + 1,
		score2: Math.floor(Math.random() * 11) + 1,
	}));
};

// Statistiques détaillées pour le Dashboard
export const DEMO_STATS = {
	totalMatches: 25,
	wins: 18,
	losses: 7,
	winRate: 72,
	totalPlayTime: "15h 32m",
	bestStreak: 8,
	currentStreak: 3,
	averageScore: 8.4,
	bestScore: 11,
	tournamentsWon: 3,
	tournamentsPlayed: 5,
	rank: 42,
	points: 1847,
	level: 15,
	experience: 2340,
	nextLevelExp: 2500,
};

// Données pour les graphiques (derniers 7 jours)
export const DEMO_CHART_DATA = {
	matches: [
		{ date: "2025-06-01", wins: 3, losses: 1 },
		{ date: "2025-06-02", wins: 2, losses: 2 },
		{ date: "2025-06-03", wins: 4, losses: 0 },
		{ date: "2025-06-04", wins: 1, losses: 2 },
		{ date: "2025-06-05", wins: 3, losses: 1 },
		{ date: "2025-06-06", wins: 2, losses: 1 },
		{ date: "2025-06-07", wins: 3, losses: 0 },
	],
	scores: [
		{ date: "2025-06-01", average: 8.5 },
		{ date: "2025-06-02", average: 7.2 },
		{ date: "2025-06-03", average: 9.8 },
		{ date: "2025-06-04", average: 6.5 },
		{ date: "2025-06-05", average: 8.9 },
		{ date: "2025-06-06", average: 8.1 },
		{ date: "2025-06-07", average: 10.2 },
	],
	playTime: [
		{ date: "2025-06-01", minutes: 125 },
		{ date: "2025-06-02", minutes: 98 },
		{ date: "2025-06-03", minutes: 156 },
		{ date: "2025-06-04", minutes: 67 },
		{ date: "2025-06-05", minutes: 134 },
		{ date: "2025-06-06", minutes: 89 },
		{ date: "2025-06-07", minutes: 178 },
	],
};

// Classement global pour la page Home
export const DEMO_LEADERBOARD = [
	{
		rank: 1,
		uuid: "top-player-1",
		username: "PongMaster",
		avatar: "/default.png",
		points: 2341,
		wins: 45,
		losses: 3,
		winRate: 94,
	},
	{
		rank: 2,
		uuid: "top-player-2",
		username: "TableTennis",
		avatar: "/default.png",
		points: 2198,
		wins: 38,
		losses: 5,
		winRate: 88,
	},
	{
		rank: 3,
		uuid: "top-player-3",
		username: "PaddlePro",
		avatar: "/default.png",
		points: 2067,
		wins: 41,
		losses: 8,
		winRate: 84,
	},
	// Position de l'utilisateur démo
	{
		rank: 42,
		uuid: "demo-user-123",
		username: "DemoPlayer",
		avatar: "/default.png",
		points: 1847,
		wins: 18,
		losses: 7,
		winRate: 72,
	},
	{
		rank: 43,
		uuid: "player-43",
		username: "CasualGamer",
		avatar: "/default.png",
		points: 1823,
		wins: 16,
		losses: 9,
		winRate: 64,
	},
];

// Actualités/News pour la page Home
export const DEMO_NEWS = [
	{
		id: 1,
		title: "Nouveau Tournoi Hebdomadaire !",
		content: "Participez au grand tournoi de cette semaine avec des prix exceptionnels !",
		date: "2025-06-07",
		type: "tournament",
		urgent: true,
	},
	{
		id: 2,
		title: "Mise à jour des règles",
		content: "Les nouvelles règles du jeu sont maintenant en vigueur.",
		date: "2025-06-05",
		type: "update",
		urgent: false,
	},
	{
		id: 3,
		title: "Nouvelle fonctionnalité : Mode Spectateur",
		content: "Vous pouvez maintenant regarder les matchs de vos amis en temps réel !",
		date: "2025-06-03",
		type: "feature",
		urgent: false,
	},
];

// Matchs récents pour la page Home
export const DEMO_RECENT_MATCHES = [
	{
		uuid: "recent-1",
		player1: "PlayerOne",
		player2: "GameMaster",
		score1: 11,
		score2: 7,
		date: "2025-06-07 15:30",
		duration: "4m 23s",
		winner: "PlayerOne",
	},
	{
		uuid: "recent-2",
		player1: "PongChamp",
		player2: "demo-user-123",
		score1: 9,
		score2: 11,
		date: "2025-06-07 14:15",
		duration: "6m 12s",
		winner: "DemoPlayer",
	},
	{
		uuid: "recent-3",
		player1: "GameMaster",
		player2: "PlayerOne",
		score1: 11,
		score2: 8,
		date: "2025-06-07 13:45",
		duration: "5m 07s",
		winner: "GameMaster",
	},
];

// Profils étendus avec plus de détails pour ProfileFriend
export const DEMO_EXTENDED_FRIENDS: { [key: string]: any } = {
	"friend-1": {
		...DEMO_FRIENDS[0],
		bio: "Joueur passionné depuis 2020. Spécialisé dans les coups de revers.",
		country: "France",
		joinDate: "2023-03-15",
		favoriteMode: "Classic",
		achievements: [
			{ name: "Première Victoire", date: "2023-03-16", icon: "🏆" },
			{ name: "Série de 10", date: "2023-05-20", icon: "🔥" },
			{ name: "Maître du Revers", date: "2023-08-12", icon: "🏓" },
		],
		stats: {
			totalMatches: 156,
			wins: 98,
			losses: 58,
			winRate: 63,
			bestStreak: 12,
			averageScore: 7.8,
			totalPlayTime: "28h 45m",
		},
	},
	"friend-2": {
		...DEMO_FRIENDS[1],
		bio: "Organisateur de tournois et mentor pour nouveaux joueurs.",
		country: "Canada",
		joinDate: "2022-11-08",
		favoriteMode: "Tournament",
		achievements: [
			{ name: "Organisateur", date: "2023-01-10", icon: "👑" },
			{ name: "Mentor", date: "2023-04-22", icon: "🎓" },
			{ name: "Tournoi Master", date: "2023-07-15", icon: "🏆" },
		],
		stats: {
			totalMatches: 203,
			wins: 134,
			losses: 69,
			winRate: 66,
			bestStreak: 15,
			averageScore: 8.2,
			totalPlayTime: "42h 18m",
		},
	},
	"friend-3": {
		...DEMO_FRIENDS[2],
		bio: "Champion régional 2023. Toujours prêt pour un défi !",
		country: "Espagne",
		joinDate: "2023-01-20",
		favoriteMode: "Ranked",
		achievements: [
			{ name: "Champion Régional", date: "2023-09-30", icon: "🥇" },
			{ name: "Perfectionniste", date: "2023-11-12", icon: "💎" },
			{ name: "Série de 20", date: "2024-01-05", icon: "🔥" },
		],
		stats: {
			totalMatches: 289,
			wins: 221,
			losses: 68,
			winRate: 76,
			bestStreak: 20,
			averageScore: 9.1,
			totalPlayTime: "58h 32m",
		},
	},
};

// Messages de chat pour demo
export const DEMO_CHAT_MESSAGES = [
	{
		id: 1,
		sender: "friend-1",
		message: "Salut ! Prêt pour un match ?",
		timestamp: Date.now() - 300000, // 5 minutes ago
		read: true,
	},
	{
		id: 2,
		sender: "demo-user-123",
		message: "Toujours ! On fait ça maintenant ?",
		timestamp: Date.now() - 240000, // 4 minutes ago
		read: true,
	},
	{
		id: 3,
		sender: "friend-1",
		message: "Parfait, je lance une partie !",
		timestamp: Date.now() - 180000, // 3 minutes ago
		read: true,
	},
	{
		id: 4,
		sender: "friend-2",
		message: "Quelqu'un pour le tournoi de ce soir ?",
		timestamp: Date.now() - 120000, // 2 minutes ago
		read: false,
	},
];

// Notifications pour demo
export const DEMO_NOTIFICATIONS = [
	{
		id: 1,
		type: "friend_request",
		title: "Nouvelle demande d'ami",
		message: "NewPlayer souhaite vous ajouter en ami",
		timestamp: Date.now() - 43200000, // 12 hours ago
		read: false,
		data: { user_uuid: "friend-4" },
	},
	{
		id: 2,
		type: "match_invite",
		title: "Invitation à un match",
		message: "PongChamp vous invite à jouer",
		timestamp: Date.now() - 1800000, // 30 minutes ago
		read: false,
		data: { match_uuid: "invite-1" },
	},
	{
		id: 3,
		type: "tournament",
		title: "Tournoi disponible",
		message: "Un nouveau tournoi commence dans 1 heure",
		timestamp: Date.now() - 3600000, // 1 hour ago
		read: true,
		data: { tournament_uuid: "tournament-3" },
	},
];

// Paramètres utilisateur pour demo
export const DEMO_USER_SETTINGS = {
	notifications: {
		friend_requests: true,
		match_invites: true,
		tournament_updates: true,
		chat_messages: true,
		sound_effects: true,
	},
	privacy: {
		profile_visible: true,
		show_online_status: true,
		allow_friend_requests: true,
		show_match_history: true,
	},
	game: {
		difficulty: "medium",
		paddle_color: "#3B82F6",
		ball_color: "#FFFFFF",
		background_theme: "classic",
		sound_volume: 75,
	},
};
