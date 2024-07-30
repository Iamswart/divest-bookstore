import { Model, ModelStatic } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class OrderItem extends Model {
    public id!: string;
    public orderId!: string;
    public bookId!: string;
    public quantity!: number;
    public price!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public static associate(models: {
      Order: ModelStatic<Model<any, any>>;
      Book: ModelStatic<Model<any, any>>;
    }): void {
      // An OrderItem belongs to an Order
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
      });

      // An OrderItem belongs to a Book
      OrderItem.belongsTo(models.Book, {
        foreignKey: 'bookId',
        as: 'book',
      });
    }
  }

  OrderItem.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    orderId: {
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    underscored: true,
    timestamps: true,
  });

  return OrderItem;
};
