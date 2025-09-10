import jwt from "jsonwebtoken";
import { IJwtService } from "../..//application/services/IJwtService";

export class JwtService implements IJwtService {
  constructor(private secret: string) {}

   sign(payload: object, expiresIn: number | string = "1h" ): string {
    return jwt.sign(payload, this.secret as jwt.Secret,  { expiresIn: '1h' });
  }

  verify<T>(token: string): T | null {
    try {
      return jwt.verify(token, this.secret) as T;
    } catch {
      return null;
    }
  }
}
