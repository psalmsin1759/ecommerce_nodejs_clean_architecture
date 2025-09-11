import { Request, Response } from "express";
import { MongoAdminRepository } from "../../../infrastructure/database/mongoose/MongoAdminRepository";
import { CreateAdminUseCase } from "../../../application/use-cases/admin/CreateAdminUseCase";
import { GetAdminUseCase } from "../../../application/use-cases/admin/GetAdminUseCase";
import { UpdateAdminUseCase } from "../../../application/use-cases/admin/UpdateAdminUseCase";
import { DeleteAdminUseCase } from "../../../application/use-cases/admin/DeleteAdminUseCase";
import { ListAdminsUseCase } from "../../../application/use-cases/admin/ListAdminsUseCase";
import { LoginUseCase } from "../../../application/use-cases/admin/LoginUseCase";
import { ChangePasswordUseCase } from "../../../application/use-cases/admin/ChangePasswordUseCase";
import { AssignRoleUseCase } from "../../../application/use-cases/admin/AssignRoleUseCase";
import { JwtService } from "../../../infrastructure/security/JwtService";
import { config } from "../../../config/env";

const repo = new MongoAdminRepository();
const jwtService = new JwtService(config.jwtSecret);

export class AdminController {
  async create(req: Request, res: Response) {
    try {
      const usecase = new CreateAdminUseCase(repo);
      const admin = await usecase.execute(req.body);
      res.status(201).json(admin);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Admin ID is required" });
      const usecase = new GetAdminUseCase(repo);
      const admin = await usecase.execute(id);
      if (!admin) return res.status(404).json({ error: "Admin not found" });
      res.json(admin);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Admin ID is required" });
      const usecase = new UpdateAdminUseCase(repo);
      const updated = await usecase.execute(id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Admin ID is required" });
      const usecase = new DeleteAdminUseCase(repo);
      const ok = await usecase.execute(id);
      res.json({ success: ok });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const usecase = new ListAdminsUseCase(repo);
      const filter = {
        status: req.query.status as string,
        role: req.query.role as string,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      };
      const list = await usecase.execute(filter);
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const {email, password} = req.body;
      const usecase = new LoginUseCase(repo, jwtService);
      const { admin, token } = await usecase.execute(
        email,
        password
      );
      res.json({ admin, token });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Admin ID is required" });

      const usecase = new ChangePasswordUseCase(repo);
      await usecase.execute(id, req.body.oldPassword, req.body.newPassword);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async assignRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Admin ID is required" });
      const usecase = new AssignRoleUseCase(repo);
      const updated = await usecase.execute(id, req.body.role);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
