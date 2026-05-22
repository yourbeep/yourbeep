export type AdminGame = {
  _id: string;
  key: string;
  title: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GamesState = {
  items: AdminGame[];
  hasLoaded: boolean;
  loading: boolean;
  mutating: boolean;
  error: string | null;
};
