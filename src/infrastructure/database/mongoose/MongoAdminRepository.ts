import { AdminRepository } from "../../../domain/repositories/AdminRepository";
import { Admin } from "../../../domain/entities/Admin";
import { AdminModel } from "./models/AdminModel";

export class MongoAdminRepository implements AdminRepository {
  async create(admin: Admin): Promise<Admin> {
    const doc = await AdminModel.create({
      ...admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Admin | null> {
    const doc = await AdminModel.findOne({ id }).lean();
    return doc ? (doc as unknown as Admin) : null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const doc = await AdminModel.findOne({ email }).lean();
    return doc ? (doc as unknown as Admin) : null;
  }

  async findByUsername(username: string): Promise<Admin | null> {
    const doc = await AdminModel.findOne({ username }).lean();
    return doc ? (doc as unknown as Admin) : null;
  }

  async update(id: string, update: Partial<Admin>): Promise<Admin | null> {
    const doc = await AdminModel.findOneAndUpdate(
      { id },
      { ...update, updatedAt: new Date() },
      { new: true }
    ).lean();
    return doc ? (doc as unknown as Admin) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await AdminModel.deleteOne({ id });
    return res.deletedCount === 1;
  }

  async list(filter: any = {}): Promise<{ items: Admin[]; total: number }> {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit =
      filter.limit && filter.limit > 0 ? Math.min(filter.limit, 100) : 20;
    const query: any = {};
    if (filter.status) query.status = filter.status;
    if (filter.role) query["roles.name"] = filter.role;
    if (filter.search)
      query.$or = [
        { username: { $regex: filter.search, $options: "i" } },
        { email: { $regex: filter.search, $options: "i" } },
        { fullName: { $regex: filter.search, $options: "i" } },
      ];

    const [items, total] = await Promise.all([
      AdminModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AdminModel.countDocuments(query),
    ]);
    return { items: items as unknown as Admin[], total };
  }

  async setPassword(id: string, passwordHash: string): Promise<void> {
    await AdminModel.updateOne(
      { id },
      { $set: { passwordHash, updatedAt: new Date() } }
    );
  }

  async recordLogin(id: string): Promise<void> {
    await AdminModel.updateOne(
      { id },
      { $set: { lastLogin: new Date(), updatedAt: new Date() } }
    );
  }

  private toDomain(doc: any): Admin {
    const d = doc.toObject ? doc.toObject() : doc;
    return {
      id: d.id,
      username: d.username,
      email: d.email,
      phone: d.phone,
      fullName: d.fullName,
      passwordHash: d.passwordHash,
      roles: d.roles,
      status: d.status,
      lastLogin: d.lastLogin ? d.lastLogin.toISOString() : undefined,
      createdAt: d.createdAt ? d.createdAt.toISOString() : undefined,
      updatedAt: d.updatedAt ? d.updatedAt.toISOString() : undefined,
    };
  }
}
