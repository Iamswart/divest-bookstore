import { Model, ModelStatic } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Cart extends Model {
    public id!: string;
    public userId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    public static associate(models: {
      User: ModelStatic<Model<any, any>>;
      CartItem: ModelStatic<Model<any, any>>;
    }): void {
      // A Cart belongs to a User
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // A Cart has many CartItems
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId',
        as: 'cartItems',
      });
    }
  }

  Cart.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    underscored: true,
    timestamps: true,
  });

  return Cart;
};
