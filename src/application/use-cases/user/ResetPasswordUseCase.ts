import { UserRepository } from "../../../domain/repositories/UserRepository";
import { ResetPasswordDTO } from "../../dto/user/UserDTO";
import bcrypt from "bcryptjs";

export class ResetPasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: ResetPasswordDTO): Promise<void> {
    const user = await this.userRepository.findByPasswordResetToken(dto.token);
    if (!user || !user.passwordResetExpiresAt || new Date(user.passwordResetExpiresAt) < new Date()) {
      throw new Error("Invalid or expired token");
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.updatePassword(user.id, passwordHash);
    await this.userRepository.clearPasswordResetToken(user.id);
  }
}
