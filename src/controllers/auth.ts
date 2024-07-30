import { RegisterInterface, LoginInterface } from "../interfaces/auth";
import logger from "../logger";
import AuthService from "../services/auth";

export default class AuthController {
  private authService = new AuthService();

  async registerUser(input: RegisterInterface) {
    try {
      return await this.authService.register(input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async loginUser(input: LoginInterface) {
    try {
      return await this.authService.login(input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
