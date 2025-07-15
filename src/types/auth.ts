export type User = {
  email: string;
  password: string;
};

export interface AuthContextType {
  user: User | null;
  signup: (user: User) => boolean;
  login: (user: User) => boolean;
  logout: () => void;
  loading: boolean;
} 