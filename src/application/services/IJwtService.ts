export interface IJwtService {
  sign(payload: object, expiresIn?: string): string;
  verify<T>(token: string): T | null;
}
