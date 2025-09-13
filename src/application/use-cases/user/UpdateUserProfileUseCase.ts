
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { UpdateUserProfileDTO } from "../../dto/user/UserDTO";
import { User } from "@/domain/entities/User";

export class UpdateUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, dto: UpdateUserProfileDTO): Promise<User> {
    return this.userRepository.update(userId, { ...dto, updatedAt: new Date().toISOString() });
  }
}
