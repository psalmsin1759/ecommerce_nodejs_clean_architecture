import { Request, Response } from "express";
import { MongoUserRepository } from "../../../infrastructure/database/mongoose/MongoUserRepository";
import { RegisterUserDTO, LoginUserDTO } from "../../../application/dto/user/UserDTO";

import {LoginUserUseCase} from "../../../application/use-cases/user/LoginUserUseCase";
import {RegisterUserUseCase} from "../../../application/use-cases/user/RegisterUserUseCase";
import { JwtService } from "../../../infrastructure/security/JwtService";
import { config } from "../../../config/env";

const userRepository = new MongoUserRepository();
const jwtService = new JwtService(config.jwtSecret);
export class UserController {

  async create(req: Request, res: Response) {
    try {
      const dto: RegisterUserDTO = req.body;
      const useCase = new RegisterUserUseCase(userRepository, jwtService);
      const user = await useCase.execute(dto);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }


  async login(req: Request, res: Response) {
    try {
      const dto: LoginUserDTO = {
        email: req.body.email!,
        password: req.body.password!,
        ip: req.ip!,
      };

      const useCase = new LoginUserUseCase(userRepository, jwtService);
      const authResponse = await useCase.execute(dto);

      res.status(200).json(authResponse);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }



}
