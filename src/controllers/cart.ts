import { CreateCartItemInterface, UpdateCartItemInterface } from '../interfaces/cart';
import logger from '../logger';
import CartService from '../services/cart';

export default class CartController {
  private cartService = new CartService();

  async addBookToCart(userId: string, input: CreateCartItemInterface) {
    try {
      return await this.cartService.addBookToCart(userId, input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async viewCart(userId: string) {
    try {
      return await this.cartService.viewCart(userId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async deleteCartItem(userId: string, cartItemId: string) {
    try {
      return await this.cartService.deleteCartItem(userId, cartItemId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async updateCartItem(userId: string, input: UpdateCartItemInterface) {
    try {
      return await this.cartService.updateCartItem(userId, input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
