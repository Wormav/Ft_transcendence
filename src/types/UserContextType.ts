export type UserData = {
	uuid: string;
	email: string;
	username: string;
	avatar: string;
	color_items: string;
	color_bg: string;
	size_text: number;
	speed_moves: string;
};

export type UserContextType = {
	user: UserData | null;
	loading: boolean;
	error: string | null;
	fetchUserData: () => Promise<void>;
	updateUsername: (username: string) => Promise<boolean>;
	updateEmail: (email: string) => Promise<boolean>;
	updateAvatar: (avatar: string) => Promise<boolean>;
};
