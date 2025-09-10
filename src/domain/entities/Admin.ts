export type AdminStatus = "active" | "disabled" | "pending";

export interface Role {
  id?: string | undefined;
  name: string; // superadmin, admin, editor
  permissions?: string[]; // ['orders:read','orders:update']
}

export interface Admin {
  id: string;
  username?: string | undefined;
  email: string;
  phone?: string | undefined;
  fullName?: string | undefined;
  passwordHash?: string;
  roles: Role[];
  status: AdminStatus;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}
