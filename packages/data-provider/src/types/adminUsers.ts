export type TAdminUsersSortBy = 'createdAt' | 'name' | 'email';

export type TAdminUsersParams = {
  search?: string;
  role?: string;
  provider?: string;
  sortBy?: TAdminUsersSortBy;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};

export type TAdminUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  provider: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TAdminUsersResponse = {
  users: TAdminUser[];
  total: number;
  limit: number;
  offset: number;
};
