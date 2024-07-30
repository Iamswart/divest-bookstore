import CartService from '../src/services/cart';
import db, { sequelize } from '../src/database/models';

jest.mock('../src/database/models', () => ({
  __esModule: true,
  default: {
    Cart: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
    CartItem: {
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      save: jest.fn(),
    },
    Book: {
      findByPk: jest.fn(),
    },
  },
  sequelize: {
    close: jest.fn(),
  },
}));

const mockBook = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  genre: 'Test Genre',
  price: 10,
  stock: 100,
};

const mockCartItem = {
  id: '1',
  cartId: '1',
  bookId: '1',
  quantity: 1,
  save: jest.fn(),
  destroy: jest.fn(),  // Add destroy method here
};

const mockCart = {
  id: '1',
  userId: '1',
  cartItems: [mockCartItem],
};

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
    jest.clearAllMocks();
  });

  describe('addBookToCart', () => {
    it('should add a book to the cart successfully', async () => {
      const userId = '1';
      const input = { bookId: '1', quantity: 1 };
      
      (db.Book.findByPk as jest.Mock).mockResolvedValue(mockBook);
      (db.Cart.findOne as jest.Mock).mockResolvedValue(null);
      (db.Cart.create as jest.Mock).mockResolvedValue(mockCart);
      (db.CartItem.findOne as jest.Mock).mockResolvedValue(null);
      (db.CartItem.create as jest.Mock).mockResolvedValue(mockCartItem);

      jest.spyOn(cartService, 'viewCart').mockResolvedValue(mockCart);
  
      const result = await cartService.addBookToCart(userId, input);
  
      expect(db.Book.findByPk).toHaveBeenCalledWith(input.bookId);
      expect(db.Cart.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(db.Cart.create).toHaveBeenCalledWith({ userId });
      expect(db.CartItem.findOne).toHaveBeenCalledWith({ where: { cartId: mockCart.id, bookId: input.bookId } });
      expect(db.CartItem.create).toHaveBeenCalledWith({ cartId: mockCart.id, bookId: input.bookId, quantity: input.quantity });
      expect(result).toEqual(mockCart);
    });

    it('should throw an error if the book is not found', async () => {
      const userId = '1';
      const input = { bookId: '2', quantity: 1 };

      (db.Book.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(cartService.addBookToCart(userId, input)).rejects.toThrow('Book not found');
    });

    it('should throw an error if the requested quantity exceeds available stock', async () => {
      const userId = '1';
      const input = { bookId: '1', quantity: 101 };

      (db.Book.findByPk as jest.Mock).mockResolvedValue(mockBook);

      await expect(cartService.addBookToCart(userId, input)).rejects.toThrow('Requested quantity exceeds available stock');
    });
  });

  describe('viewCart', () => {
    it('should return the cart details', async () => {
      const userId = '1';

      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

      const result = await cartService.viewCart(userId);

      expect(db.Cart.findOne).toHaveBeenCalledWith({
        where: { userId },
        attributes: ['id', 'userId'],
        include: [{
          model: db.CartItem,
          as: 'cartItems',
          attributes: ['id', 'cartId', 'bookId', 'quantity'],
          include: [{
            model: db.Book,
            as: 'book',
            attributes: ['id', 'title', 'author', 'genre', 'price', 'stock', 'slug'],
          }],
        }],
      });
      expect(result).toEqual(mockCart);
    });

    it('should return an empty cart if no cart exists', async () => {
      const userId = '1';

      (db.Cart.findOne as jest.Mock).mockResolvedValue(null);

      const result = await cartService.viewCart(userId);

      expect(result).toEqual({
        id: null,
        userId: userId,
        cartItems: [],
      });
    });
  });

  describe('deleteCartItem', () => {
    it('should delete a cart item successfully', async () => {
      const userId = '1';
      const cartItemId = '1';

      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
      (db.CartItem.findOne as jest.Mock).mockResolvedValue(mockCartItem);

      jest.spyOn(mockCartItem, 'destroy').mockResolvedValueOnce(null);
      jest.spyOn(cartService, 'viewCart').mockResolvedValue(mockCart);

      const result = await cartService.deleteCartItem(userId, cartItemId);

      expect(db.Cart.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(db.CartItem.findOne).toHaveBeenCalledWith({ where: { id: cartItemId, cartId: mockCart.id } });
      expect(mockCartItem.destroy).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });

    it('should throw an error if the cart is not found', async () => {
      const userId = '1';
      const cartItemId = '1';

      (db.Cart.findOne as jest.Mock).mockResolvedValue(null);

      await expect(cartService.deleteCartItem(userId, cartItemId)).rejects.toThrow('Cart not found');
    });

    it('should throw an error if the cart item is not found', async () => {
      const userId = '1';
      const cartItemId = '1';

      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
      (db.CartItem.findOne as jest.Mock).mockResolvedValue(null);

      await expect(cartService.deleteCartItem(userId, cartItemId)).rejects.toThrow('Cart item not found');
    });
  });

  describe('updateCartItem', () => {
    it('should update the cart item quantity successfully', async () => {
      const userId = '1';
      const input = { cartItemId: '1', quantity: 5 };

      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
      (db.CartItem.findOne as jest.Mock).mockResolvedValue(mockCartItem);
      (db.Book.findByPk as jest.Mock).mockResolvedValue(mockBook);

      jest.spyOn(cartService, 'viewCart').mockResolvedValue(mockCart);

      const result = await cartService.updateCartItem(userId, input);

      expect(db.Cart.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(db.CartItem.findOne).toHaveBeenCalledWith({ where: { id: input.cartItemId, cartId: mockCart.id } });
      expect(db.Book.findByPk).toHaveBeenCalledWith(mockCartItem.bookId);
      expect(mockCartItem.save).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });

    it('should throw an error if the cart is not found', async () => {
      const userId = '1';
      const input = { cartItemId: '1', quantity: 5 };

      (db.Cart.findOne as jest.Mock).mockResolvedValue(null);

      await expect(cartService.updateCartItem(userId, input)).rejects.toThrow('Cart not found');
    });

    it('should throw an error if the cart item is not found', async () => {
      const userId = '1';
      const input = { cartItemId: '1', quantity: 5 };

      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
      (db.CartItem.findOne as jest.Mock).mockResolvedValue(null);

      await expect(cartService.updateCartItem(userId, input)).rejects.toThrow('Cart item not found');
    });

    it('should throw an error if the quantity is less than or equal to zero', async () => {
      const userId = '1';
      const input = { cartItemId: '1', quantity: 0 };

      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
      (db.CartItem.findOne as jest.Mock).mockResolvedValue(mockCartItem);

      await expect(cartService.updateCartItem(userId, input)).rejects.toThrow('Quantity must be greater than zero');
    });

    it('should throw an error if the requested quantity exceeds available stock', async () => {
      const userId = '1';
      const input = { cartItemId: '1', quantity: 101 };

      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
      (db.CartItem.findOne as jest.Mock).mockResolvedValue(mockCartItem);
      (db.Book.findByPk as jest.Mock).mockResolvedValue(mockBook);

      await expect(cartService.updateCartItem(userId, input)).rejects.toThrow('Requested quantity exceeds available stock');
    });
  });
});

afterAll(done => {
  sequelize.close();
  done();
});
