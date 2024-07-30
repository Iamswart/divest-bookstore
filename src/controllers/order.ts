import logger from '../logger';
import OrderService from '../services/order';

export default class OrderController {
  private orderService = new OrderService();

  async createOrder(userId: string, note?: string) {
    try {
      return await this.orderService.createOrder(userId, note);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getOrderHistory(userId: string) {
    try {
      return await this.orderService.getOrderHistory(userId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getOrderById(userId: string, orderId: string) {
    try {
      return await this.orderService.getOrderById(orderId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
