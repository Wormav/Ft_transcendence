// Mode démo - toujours retourner un token valide
const DEMO_MODE = true;

export const getJwtToken = (): string | null => {
	// En mode démo, toujours retourner un token
	if (DEMO_MODE) {
		return "demo-jwt-token-123";
	}

	// Mode production - lire le cookie
	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split("=");
		if (name === "jwt") {
			return value;
		}
	}
	return null;
};
