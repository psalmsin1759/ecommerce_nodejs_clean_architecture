export interface CreateAdminDTO {
  username?: string | undefined;
  email: string;
  password: string;
  phone?: string;
  fullName?: string;
  roles?: { id?: string | undefined; name: string; permissions?: string[] }[];
}



export interface UpdateAdminDTO {
  email?: string;
  phone?: string;
  fullName?: string;
  roles?: { id: string; name: string; permissions?: string[] }[];
  status?: "active" | "disabled" | "pending";
}

export interface LoginDTO {
  usernameOrEmail: string;
  password: string;
}

export interface ChangePasswordDTO {
  adminId: string;
  oldPassword?: string;
  newPassword: string;
}

export interface AssignRoleDTO {
  adminId: string;
  role: { id: string; name: string; permissions?: string[] };
}
