import { Model, ModelStatic } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

module.exports = (sequelize: any, DataTypes: any) => {
  class Order extends Model {
    public id!: string;
    public userId!: string;
    public orderNumber!: string;
    public note!: string;
    public totalCost!: number;
    public paymentStatus!: 'Pending' | 'Paid' | 'Failed';
    public createdAt!: Date;
    public updatedAt!: Date;

    public static associate(models: {
      User: ModelStatic<Model<any, any>>;
      OrderItem: ModelStatic<Model<any, any>>;
    }): void {
      // An Order belongs to a User
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // An Order has many OrderItems
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'orderItems',
      });
    }
  }

  Order.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: () => `ORD-${uuidv4()}`,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    paymentStatus: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Failed'),
      allowNull: false,
      defaultValue: 'Pending',
    },
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
    timestamps: true,
  });

  return Order;
};
