import BookService from '../src/services/book';
import db, { sequelize } from '../src/database/models';
import { Op } from 'sequelize';


jest.mock('../src/database/models', () => ({
  __esModule: true,
  default: {
    Book: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
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

describe('BookService', () => {
  let bookService: BookService;

  beforeEach(() => {
    bookService = new BookService();
    jest.clearAllMocks();
  });

  describe('getBooks', () => {
    it('should return a list of books', async () => {
      const query = { title: 'Test' };
      const books = [mockBook];
      
      (db.Book.findAll as jest.Mock).mockResolvedValue(books);
      
      const result = await bookService.getBooks(query);
      
      expect(db.Book.findAll).toHaveBeenCalledWith({
        where: { title: { [Op.iLike]: '%Test%' } },
      });
      expect(result).toEqual(books);
    });

    it('should return all books if no query is provided', async () => {
      const books = [mockBook];
      
      (db.Book.findAll as jest.Mock).mockResolvedValue(books);
      
      const result = await bookService.getBooks({});
      
      expect(db.Book.findAll).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual(books);
    });
  });

  describe('viewBookDetails', () => {
    it('should return book details', async () => {
      (db.Book.findByPk as jest.Mock).mockResolvedValue(mockBook);
      
      const result = await bookService.viewBookDetails('1');
      
      expect(db.Book.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });

    it('should throw an error if book not found', async () => {
      (db.Book.findByPk as jest.Mock).mockResolvedValue(null);
      
      await expect(bookService.viewBookDetails('1')).rejects.toThrow('Book not found');
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const input = {
        title: 'New Book',
        author: 'New Author',
        genre: 'New Genre',
        price: 20,
        stock: 50,
      };
      
      (db.Book.create as jest.Mock).mockResolvedValue(mockBook);
      
      const result = await bookService.createBook(input);
      
      expect(db.Book.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockBook);
    });
  });
});

afterAll(done => {
  sequelize.close();
  done();
});
