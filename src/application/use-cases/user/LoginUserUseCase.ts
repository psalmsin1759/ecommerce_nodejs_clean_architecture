import { UserRepository } from "../../../domain/repositories/UserRepository";
import { LoginUserDTO, AuthResponseDTO } from "../../dto/user/UserDTO";
import bcrypt from "bcryptjs";
import { IJwtService } from "../../services/IJwtService";

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: IJwtService
  ) {}

  async execute(dto: LoginUserDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email!);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.status !== "active" && user.status !== "pendingVerification") {
      throw new Error(`User account is ${user.status}`);
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash!);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }


    await this.userRepository.updateLastLogin(user.id, dto.ip ?? "unknown");

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      token,
    };
  }
}
