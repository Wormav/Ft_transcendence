export type UserData = {
  uuid: string;
  email: string;
  username: string;
  avatar: string;
}

export type UserContextType = {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
}
