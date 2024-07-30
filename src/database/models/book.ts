import { Model, ModelStatic } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

module.exports = (sequelize: any, DataTypes: any) => {
  class Book extends Model {
    public id!: string;
    public title!: string;
    public author!: string;
    public genre!: string;
    public price!: number;
    public stock!: number;
    public slug!: string;
    public createdAt!: Date;
    public updatedAt!: Date;


    public static associate(models: {
      CartItem: ModelStatic<Model<any, any>>;
      OrderItem: ModelStatic<Model<any, any>>;
    }): void {
      // A Book has many CartItems
      Book.hasMany(models.CartItem, {
        foreignKey: 'bookId',
        as: 'cartItems',
      });

      // A Book has many OrderItems
      Book.hasMany(models.OrderItem, {
        foreignKey: 'bookId',
        as: 'orderItems',
      });
    }
  }

  Book.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'books',
    underscored: true,
    timestamps: true,
    hooks: {
        beforeCreate: (book: any) => {
          book.slug = slugify(`${book.title}-${uuidv4()}`, { lower: true });
        },
        beforeUpdate: (book: any) => {
          if (book.changed('title')) {
            book.slug = slugify(`${book.title}-${uuidv4()}`, { lower: true });
          }
        }
      }
  });

  return Book;
};
