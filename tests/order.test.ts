import OrderService from "../src/services/order";
import db, { sequelize } from "../src/database/models";

jest.mock("../src/database/models", () => {
  const actualSequelize = jest.requireActual("sequelize");
  const mockSequelize = new actualSequelize.Sequelize(
    "postgres://user:pass@example.com:5432/dbname",
    { logging: false }
  );
  return {
    __esModule: true,
    default: {
      Order: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
      },
      OrderItem: {
        create: jest.fn(),
      },
      Cart: {
        findOne: jest.fn(),
      },
      CartItem: {
        destroy: jest.fn(),
      },
      Book: {
        findOne: jest.fn(),
      },
      sequelize: mockSequelize,
    },
    sequelize: mockSequelize,
  };
});

const mockBook = {
  id: "1",
  title: "Test Book",
  author: "Test Author",
  genre: "Test Genre",
  price: 10,
  stock: 100,
  save: jest.fn(),
};

const mockCartItem = {
  id: "1",
  cartId: "1",
  bookId: "1",
  quantity: 1,
  book: mockBook,
};

const mockCart = {
  id: "1",
  userId: "1",
  cartItems: [mockCartItem],
};

const mockOrder = {
  id: "1",
  userId: "1",
  totalCost: 10,
  paymentStatus: "Pending",
  save: jest.fn(),
};

const mockOrderItem = {
  id: "1",
  orderId: "1",
  bookId: "1",
  quantity: 1,
  price: 10,
  book: mockBook,
};

describe("OrderService", () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
    jest.clearAllMocks();
    jest.spyOn(sequelize, "transaction").mockImplementation(() =>
      Promise.resolve({
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: {
          UPDATE: "UPDATE",
        },
      })
    );
  });

  describe("createOrder", () => {
    it("should create an order successfully", async () => {
      const userId = "1";
      const note = "Test note";
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: {
          UPDATE: "UPDATE",
        },
      };

      (sequelize.transaction as jest.Mock).mockResolvedValue(transaction);
      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
      (db.Book.findOne as jest.Mock).mockResolvedValue(mockBook);
      (db.Order.create as jest.Mock).mockResolvedValue(mockOrder);
      (db.OrderItem.create as jest.Mock).mockResolvedValue(mockOrderItem);
      (db.CartItem.destroy as jest.Mock).mockResolvedValue(1);

      const result = await orderService.createOrder(userId, note);

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(db.Cart.findOne).toHaveBeenCalledWith({
        where: { userId },
        include: [
          {
            model: db.CartItem,
            as: "cartItems",
            include: [{ model: db.Book, as: "book" }],
          },
        ],
        transaction,
      });
      expect(db.Order.create).toHaveBeenCalledWith(
        {
          userId,
          note,
          totalCost: 10,
          paymentStatus: "Pending",
        },
        { transaction }
      );
      expect(db.OrderItem.create).toHaveBeenCalledWith(
        {
          orderId: mockOrder.id,
          bookId: mockCartItem.bookId,
          quantity: mockCartItem.quantity,
          price: mockCartItem.book.price,
        },
        { transaction }
      );
      expect(db.CartItem.destroy).toHaveBeenCalledWith({
        where: { cartId: mockCart.id },
        transaction,
      });
      expect(transaction.commit).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it("should throw an error if the cart is empty", async () => {
      const userId = "1";
      const note = "Test note";
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: {
          UPDATE: "UPDATE",
        },
      };

      (sequelize.transaction as jest.Mock).mockResolvedValue(transaction);
      (db.Cart.findOne as jest.Mock).mockResolvedValue({
        ...mockCart,
        cartItems: [],
      });

      await expect(orderService.createOrder(userId, note)).rejects.toThrow(
        "Cart is empty"
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it("should throw an error if a book is not found", async () => {
      const userId = "1";
      const note = "Test note";
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: {
          UPDATE: "UPDATE",
        },
      };

      (sequelize.transaction as jest.Mock).mockResolvedValue(transaction);
      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
      (db.Book.findOne as jest.Mock).mockResolvedValue(null);

      await expect(orderService.createOrder(userId, note)).rejects.toThrow(
        "Book not found: Test Book"
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it("should throw an error if requested quantity exceeds available stock", async () => {
      const userId = "1";
      const note = "Test note";
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: {
          UPDATE: "UPDATE",
        },
      };

      (sequelize.transaction as jest.Mock).mockResolvedValue(transaction);
      (db.Cart.findOne as jest.Mock).mockResolvedValue(mockCart);
      (db.Book.findOne as jest.Mock).mockResolvedValue({
        ...mockBook,
        stock: 0,
      });

      await expect(orderService.createOrder(userId, note)).rejects.toThrow(
        "Not enough stock for book: Test Book"
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });
  });

  describe("getOrderHistory", () => {
    it("should return the order history for a user", async () => {
      const userId = "1";

      (db.Order.findAll as jest.Mock).mockResolvedValue([mockOrder]);

      const result = await orderService.getOrderHistory(userId);

      expect(db.Order.findAll).toHaveBeenCalledWith({
        where: { userId },
        attributes: [
          "id",
          "userId",
          "orderNumber",
          "note",
          "totalCost",
          "paymentStatus",
        ],
        include: [
          {
            model: db.OrderItem,
            as: "orderItems",
            attributes: ["id", "orderId", "bookId", "quantity", "price"],
            include: [
              {
                model: db.Book,
                as: "book",
                attributes: [
                  "id",
                  "title",
                  "author",
                  "genre",
                  "price",
                  "stock",
                  "slug",
                ],
              },
            ],
          },
        ],
      });
      expect(result).toEqual([mockOrder]);
    });
  });

  describe("getOrderById", () => {
    it("should return a single order by ID", async () => {
      const orderId = "1";

      (db.Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(orderId);

      expect(db.Order.findByPk).toHaveBeenCalledWith(orderId, {
        attributes: [
          "id",
          "userId",
          "orderNumber",
          "note",
          "totalCost",
          "paymentStatus",
        ],
        include: [
          {
            model: db.OrderItem,
            as: "orderItems",
            attributes: ["id", "orderId", "bookId", "quantity", "price"],
            include: [
              {
                model: db.Book,
                as: "book",
                attributes: [
                  "id",
                  "title",
                  "author",
                  "genre",
                  "price",
                  "stock",
                  "slug",
                ],
              },
            ],
          },
        ],
      });
      expect(result).toEqual(mockOrder);
    });

    it("should throw an error if the order is not found", async () => {
      const orderId = "1";

      (db.Order.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(orderService.getOrderById(orderId)).rejects.toThrow(
        "Order not found"
      );
    });
  });
});

afterAll((done) => {
  sequelize.close();
  done();
});
