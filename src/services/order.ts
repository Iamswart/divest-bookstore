import { Sequelize } from 'sequelize';
import db from '../database/models/';
import { unknownResourceError, badRequestError } from '../error';

const { Order, OrderItem, Cart, CartItem, Book, User } = db;
const sequelize: Sequelize = db.sequelize;

export default class OrderService {
  // Make a purchase
  async createOrder(userId: string, note?: string) {
    const transaction = await sequelize.transaction();
  
    try {
      // Retrieve the user's cart
      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartItem, as: 'cartItems', include: [{ model: Book, as: 'book' }] }],
        transaction,
      });
  
      if (!cart || cart.cartItems.length === 0) {
        throw badRequestError('Cart is empty');
      }
  
      // Calculate the total cost and check stock availability
      let totalCost = 0;
      for (const cartItem of cart.cartItems) {
        // Lock the book row for update
        const book = await Book.findOne({
          where: { id: cartItem.bookId },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
  
        if (!book) {
          throw unknownResourceError(`Book not found: ${cartItem.book.title}`);
        }
  
        if (cartItem.quantity > book.stock) {
          throw badRequestError(`Not enough stock for book: ${book.title}`);
        }
  
        totalCost += cartItem.quantity * book.price;
      }
  
      // Create the order
      const order = await Order.create(
        {
          userId,
          note,
          totalCost,
          paymentStatus: 'Pending',
        },
        { transaction }
      );
  
      // Create order items and update book stock
      for (const cartItem of cart.cartItems) {
        await OrderItem.create(
          {
            orderId: order.id,
            bookId: cartItem.bookId,
            quantity: cartItem.quantity,
            price: cartItem.book.price,
          },
          { transaction }
        );
  
        // Update the book's stock
        cartItem.book.stock -= cartItem.quantity;
        await cartItem.book.save({ transaction });
      }
  
      // Clear the cart
      await CartItem.destroy({ where: { cartId: cart.id }, transaction });
  
      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  

  // View order history for a customer
  async getOrderHistory(userId: string) {
    const orders = await Order.findAll({
      where: { userId },
      attributes: ['id', 'userId', 'orderNumber', 'note', 'totalCost', 'paymentStatus'], 
      include: [{
        model: OrderItem,
        as: 'orderItems',
        attributes: ['id', 'orderId', 'bookId', 'quantity', 'price'], 
        include: [{
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'author', 'genre', 'price', 'stock', 'slug'], 
        }],
      }],
    });
  
    return orders;
  }
  

  // Get a single order by ID
  async getOrderById(orderId: string) {
    const order = await Order.findByPk(orderId, {
      attributes: ['id', 'userId', 'orderNumber', 'note', 'totalCost', 'paymentStatus'], 
      include: [{
        model: OrderItem,
        as: 'orderItems',
        attributes: ['id', 'orderId', 'bookId', 'quantity', 'price'], 
        include: [{
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'author', 'genre', 'price', 'stock', 'slug'], 
        }],
      }],
    });
  
    if (!order) {
      throw unknownResourceError('Order not found');
    }
  
    return order;
  }
  
}
