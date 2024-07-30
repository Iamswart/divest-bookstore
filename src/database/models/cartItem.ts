import { Model, ModelStatic } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class CartItem extends Model {
    public id!: string;
    public cartId!: string;
    public bookId!: string;
    public quantity!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public static associate(models: {
      Cart: ModelStatic<Model<any, any>>;
      Book: ModelStatic<Model<any, any>>;
    }): void {
      // A CartItem belongs to a Cart
      CartItem.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        as: 'cart',
      });

      // A CartItem belongs to a Book
      CartItem.belongsTo(models.Book, {
        foreignKey: 'bookId',
        as: 'book',
      });
    }
  }

  CartItem.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    underscored: true,
    timestamps: true,
  });

  return CartItem;
};
