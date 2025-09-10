import { z } from "zod";

export const RoleSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  permissions: z.array(z.string()).optional(),
});

export const CreateAdminValidator = z.object({
  username: z.string().optional,
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  roles: z.array(RoleSchema).optional(),
});

export const UpdateAdminValidator = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  roles: z.array(RoleSchema).optional(),
  status: z.enum(["active", "disabled", "pending"]).optional(),
});

export const LoginValidator = z.object({
  usernameOrEmail: z.string().min(1),
  password: z.string().min(1),
});

export const ChangePasswordValidator = z.object({
  oldPassword: z.string().optional(),
  newPassword: z.string().min(8),
});

export const AssignRoleValidator = z.object({
  role: RoleSchema,
});
