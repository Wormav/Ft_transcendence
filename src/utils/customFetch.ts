import {
	DEMO_USER,
	DEMO_FRIEND_DATA,
	DEMO_TOURNAMENTS,
	DEMO_TOURNAMENT_MATCHES,
	DEMO_SEARCH_USERS,
	DEMO_STATS,
	DEMO_CHART_DATA,
	DEMO_LEADERBOARD,
	DEMO_NEWS,
	DEMO_RECENT_MATCHES,
	DEMO_EXTENDED_FRIENDS,
	DEMO_CHAT_MESSAGES,
	DEMO_NOTIFICATIONS,
	DEMO_USER_SETTINGS,
	getFriendProfileByUuid,
	getMatchesByUuid
} from "./demoData";
import { isDemoMode, DEMO_CONFIG } from "../config/demo";

// Simuler une réponse HTTP
const createMockResponse = (data: any, status: number = 200): Response => {
	return new Response(JSON.stringify(data), {
		status,
		statusText: status === 200 ? "OK" : "Error",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

// Simuler un délai de réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function customFetch(
	url: string,
	options: RequestInit,
): Promise<Response> {
	// En mode démo, intercepter les appels API
	if (isDemoMode()) {
		// Ajouter un délai pour simuler la latence réseau
		const delayTime = Math.random() * (DEMO_CONFIG.API_DELAY.MAX - DEMO_CONFIG.API_DELAY.MIN) + DEMO_CONFIG.API_DELAY.MIN;
		await delay(delayTime);

		// Parser l'URL pour déterminer l'endpoint
		const urlObj = new URL(url);
		const path = urlObj.pathname;
		const method = options.method || "GET";

		console.log(`[DEMO] ${method} ${path}`);

		// Routes d'authentification
		if (path.includes("/auth/login")) {
			if (method === "POST") {
				return createMockResponse({ token: "demo-token-123" });
			}
		}

		if (path.includes("/auth/register")) {
			if (method === "POST") {
				return createMockResponse({ message: "User registered successfully" });
			}
		}

		if (path.includes("/auth/google/login")) {
			// Redirection Google (ne devrait pas être appelée en mode démo)
			return createMockResponse({ error: "Google auth not available in demo" }, 400);
		}

		// Routes utilisateur
		if (path.includes("/user/me")) {
			if (method === "GET") {
				return createMockResponse(DEMO_USER);
			}
		}

		if (path.match(/\/user\/[^\/]+$/) && !path.includes("/friends") && !path.includes("/options")) {
			if (method === "GET") {
				const uuid = path.split("/").pop();
				if (uuid === DEMO_USER.uuid) {
					return createMockResponse(DEMO_USER);
				}
				const friendProfile = getFriendProfileByUuid(uuid!);
				if (friendProfile) {
					return createMockResponse(friendProfile);
				}
				return createMockResponse({ error: "User not found" }, 404);
			}
		}

		if (path.includes("/user/update")) {
			if (method === "PUT") {
				// Simuler la mise à jour de l'utilisateur
				return createMockResponse({ message: "User updated successfully" });
			}
		}

		if (path.includes("/user/options")) {
			if (method === "PUT") {
				// Simuler la mise à jour des options
				return createMockResponse({ message: "Options updated successfully" });
			}
		}

		if (path.includes("/user/users")) {
			if (method === "GET") {
				return createMockResponse(DEMO_SEARCH_USERS);
			}
		}

		// Routes d'amis
		if (path.includes("/user/friends") && !path.match(/\/user\/friends\/[^\/]+$/)) {
			if (method === "GET") {
				return createMockResponse(DEMO_FRIEND_DATA);
			}
		}

		if (path.match(/\/user\/friends\/[^\/]+$/)) {
			if (method === "POST") {
				// Ajouter un ami
				return createMockResponse({ message: "Friend request sent" });
			}
			if (method === "PUT") {
				// Accepter/décliner une demande d'ami
				return createMockResponse({ message: "Friend request updated" });
			}
			if (method === "DELETE") {
				// Supprimer un ami
				return createMockResponse({ message: "Friend removed" });
			}
		}

		// Routes de jeu/match
		if (path.match(/\/game\/match\/user\/[^\/]+$/)) {
			if (method === "GET") {
				const uuid = path.split("/").pop();
				const matches = getMatchesByUuid(uuid!);
				return createMockResponse(matches);
			}
		}

		if (path.includes("/game/match") && !path.includes("/user")) {
			if (method === "POST") {
				// Créer un match
				const newMatch = {
					uuid: `demo-match-${Date.now()}`,
					player: DEMO_USER.uuid,
					guest: "Guest",
					guest2: null,
					score1: 0,
					score2: 0,
					starttime: new Date().toISOString(),
					endtime: null,
					finished: 0,
					tournament: null,
				};
				return createMockResponse(newMatch);
			}
			if (method === "PUT") {
				// Mettre à jour un match
				return createMockResponse({ message: "Match updated successfully" });
			}
		}

		if (path.match(/\/game\/match\/[^\/]+$/)) {
			if (method === "GET") {
				const matchId = path.split("/").pop();
				const match = DEMO_TOURNAMENT_MATCHES[matchId!];
				if (match) {
					return createMockResponse(match);
				}
				return createMockResponse({ error: "Match not found" }, 404);
			}
		}

		// Routes de tournoi
		if (path.match(/\/game\/tournament\/user\/[^\/]+$/)) {
			if (method === "GET") {
				return createMockResponse(DEMO_TOURNAMENTS);
			}
		}

		if (path.match(/\/game\/tournament\/[^\/]+$/) && !path.includes("/user")) {
			if (method === "GET") {
				const tournamentId = path.split("/").pop();
				const tournament = DEMO_TOURNAMENTS.find(t => t.uuid === tournamentId);
				if (tournament) {
					return createMockResponse(tournament);
				}
				return createMockResponse({ error: "Tournament not found" }, 404);
			}
			if (method === "PUT") {
				// Mettre à jour un tournoi
				return createMockResponse({ message: "Tournament updated successfully" });
			}
		}

		if (path.includes("/game/tournament") && method === "POST") {
			// Créer un tournoi
			const newTournament = {
				uuid: `demo-tournament-${Date.now()}`,
				host: DEMO_USER.uuid,
				players: [DEMO_USER.uuid],
				matches: [],
				bracket: {},
				winner: null,
				finished: 0,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};
			return createMockResponse(newTournament);
		}

		// Routes de statistiques et dashboard
		if (path.includes("/stats/dashboard")) {
			if (method === "GET") {
				return createMockResponse(DEMO_STATS);
			}
		}

		if (path.includes("/stats/charts")) {
			if (method === "GET") {
				return createMockResponse(DEMO_CHART_DATA);
			}
		}

		// Routes de classement
		if (path.includes("/leaderboard")) {
			if (method === "GET") {
				return createMockResponse(DEMO_LEADERBOARD);
			}
		}

		// Routes de news/actualités
		if (path.includes("/news")) {
			if (method === "GET") {
				return createMockResponse(DEMO_NEWS);
			}
		}

		// Routes de matchs récents
		if (path.includes("/recent-matches")) {
			if (method === "GET") {
				return createMockResponse(DEMO_RECENT_MATCHES);
			}
		}

		// Routes de profil étendu d'ami
		if (path.match(/\/user\/profile\/[^\/]+$/)) {
			if (method === "GET") {
				const uuid = path.split("/").pop();
				const extendedFriend = DEMO_EXTENDED_FRIENDS[uuid!];
				if (extendedFriend) {
					return createMockResponse(extendedFriend);
				}
				return createMockResponse({ error: "Profile not found" }, 404);
			}
		}

		// Routes de chat
		if (path.includes("/chat/messages")) {
			if (method === "GET") {
				return createMockResponse(DEMO_CHAT_MESSAGES);
			}
			if (method === "POST") {
				return createMockResponse({ message: "Message sent successfully" });
			}
		}

		// Routes de notifications
		if (path.includes("/notifications")) {
			if (method === "GET") {
				return createMockResponse(DEMO_NOTIFICATIONS);
			}
			if (method === "PUT") {
				return createMockResponse({ message: "Notification updated" });
			}
		}

		// Routes de paramètres utilisateur
		if (path.includes("/user/settings")) {
			if (method === "GET") {
				return createMockResponse(DEMO_USER_SETTINGS);
			}
			if (method === "PUT") {
				return createMockResponse({ message: "Settings updated successfully" });
			}
		}

		// Route par défaut - retourner une erreur 404
		console.warn(`[DEMO] Route non gérée: ${method} ${path}`);
		return createMockResponse({ error: "Route not found in demo mode" }, 404);
	}

	// Mode production - utiliser fetch normal
	const response = await fetch(url, options);

	// Gérer uniquement les erreurs 401 pour la redirection
	if (response.status === 401) {
		if (
			typeof window !== "undefined" &&
			window.location.pathname !== "/login"
		) {
			window.location.href = "/login";
		}
		throw new Error("Unauthorized");
	}

	return response;
}
