import { Op } from 'sequelize';
import { SearchBooksInterface, CreateBookInterface } from '../interfaces/book';
import db from '../database/models/';
import { unknownResourceError } from '../error';

const { Book } = db;

export default class BookService {
  // List all books or search for books by title, author, or genre
  async getBooks(query: SearchBooksInterface) {
    const { title, author, genre } = query;
    const whereClause: any = {};

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` };
    }
    if (author) {
      whereClause.author = { [Op.iLike]: `%${author}%` };
    }
    if (genre) {
      whereClause.genre = { [Op.iLike]: `%${genre}%` };
    }

    const books = await Book.findAll({
      where: whereClause,
    });

    return books;
  }

  // View details of a specific book
  async viewBookDetails(id: string) {
    const book = await Book.findByPk(id);

    if (!book) {
      throw unknownResourceError('Book not found');
    }

    return book;
  }

  // Create a new book
  async createBook(input: CreateBookInterface) {
    const { title, author, genre, price, stock } = input;

    const book = await Book.create({
      title,
      author,
      genre,
      price,
      stock,
    });

    return book;
  }
}
