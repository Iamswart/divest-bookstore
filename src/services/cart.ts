import { CreateCartItemInterface, UpdateCartItemInterface } from '../interfaces/cart';
import db from '../database/models/';
import { unknownResourceError, badRequestError } from '../error';

const { Cart, CartItem, Book } = db;

export default class CartService {
  // Add a book to the shopping cart
  async addBookToCart(userId: string, input: CreateCartItemInterface) {
    const { bookId, quantity } = input;

    // Check if the book exists and its stock
    const book = await Book.findByPk(bookId);
    if (!book) {
      throw unknownResourceError('Book not found');
    }

    if (book.stock < quantity) {
      throw badRequestError('Requested quantity exceeds available stock');
    }

    // Check if the user has a cart, if not create one
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // Check if the book is already in the cart
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, bookId } });
    if (cartItem) {
      // If the book is already in the cart, update the quantity
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > book.stock) {
        throw badRequestError('Requested quantity exceeds available stock');
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // If the book is not in the cart, add it
      await CartItem.create({ cartId: cart.id, bookId, quantity });
    }

    return await this.viewCart(userId);
  }

  // View the contents of the shopping cart
  async viewCart(userId: string) {
    const cart = await Cart.findOne({
      where: { userId },
      attributes: ['id', 'userId'], 
      include: [{
        model: CartItem,
        as: 'cartItems',
        attributes: ['id', 'cartId', 'bookId', 'quantity'], 
        include: [{
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'author', 'genre', 'price', 'stock', 'slug'], 
        }],
      }],
    });
  
    if (!cart) {
      return {
        id: null,
        userId: userId,
        cartItems: [],
      };
    }
  
    return cart;
  }
  

  // Delete an item from the cart
  async deleteCartItem(userId: string, cartItemId: string) {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw unknownResourceError('Cart not found');
    }

    const cartItem = await CartItem.findOne({ where: { id: cartItemId, cartId: cart.id } });

    if (!cartItem) {
      throw unknownResourceError('Cart item not found');
    }

    await cartItem.destroy();

    return await this.viewCart(userId);
  }

  // Edit cart item by increasing or decreasing quantity
  async updateCartItem(userId: string, input: UpdateCartItemInterface) {
    const { cartItemId, quantity } = input;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw unknownResourceError('Cart not found');
    }

    const cartItem = await CartItem.findOne({ where: { id: cartItemId, cartId: cart.id } });

    if (!cartItem) {
      throw unknownResourceError('Cart item not found');
    }

    // Ensure the new quantity is not zero or negative
    if (quantity <= 0) {
      throw badRequestError('Quantity must be greater than zero');
    }

    // Check if the requested quantity exceeds the available stock
    const book = await Book.findByPk(cartItem.bookId);
    if (!book) {
      throw unknownResourceError('Book not found');
    }

    if (quantity > book.stock) {
      throw badRequestError('Requested quantity exceeds available stock');
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return await this.viewCart(userId);
  }
}
