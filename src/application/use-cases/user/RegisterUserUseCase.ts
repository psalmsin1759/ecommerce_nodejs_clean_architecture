import { UserRepository } from "../../../domain/repositories/UserRepository";
import { RegisterUserDTO, AuthResponseDTO } from "../../dto/user/UserDTO";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcryptjs";
import { IJwtService } from "../../services/IJwtService";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: IJwtService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<AuthResponseDTO> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const id = `${Math.floor(Math.random() * 1000000)}`;
    const user: User = {
      id,
      email: dto.email,
      phoneNumber: dto.phoneNumber || null,
      passwordHash,
      status: "pendingVerification",
      firstName: dto.firstName || null,
      lastName: dto.lastName || null,
      username: dto.username || null,
      gender: null,
      dateOfBirth: null,
      profileImageUrl: null,
      addresses: [],
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      lastLoginAt: null,
      lastLoginIp: null,
      failedLoginAttempts: 0,
      passwordResetToken: null,
      passwordResetExpiresAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    const createdUser = await this.userRepository.create(user);

    const token = this.jwtService.sign({
      id: createdUser.id,
      email: createdUser.email,
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      firstName: createdUser.firstName ?? null,
      lastName: createdUser.lastName ?? null,
      token,
    };
  }
}
