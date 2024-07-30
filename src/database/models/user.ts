import { Model, ModelStatic } from "sequelize";
import bcrypt from "bcrypt";

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model {
    public id!: string;
    public email!: string;
    public name!: string;
    public password!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public lastLoginAt!: Date;
    public isAdmin!: boolean;

    public static associate(models: {
      Order: ModelStatic<Model<any, any>>;
      Cart: ModelStatic<Model<any, any>>;
    }): void {
      // A User has many Orders
      User.hasMany(models.Order, {
        foreignKey: "userId",
        as: "orders",
      });

      // A User has one Cart
      User.hasOne(models.Cart, {
        foreignKey: "userId",
        as: "cart",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isLongEnough(value: string) {
            if (!value) return;
            if (value.length < 8) {
              throw new Error("Please choose a longer password");
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(value, salt);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.setDataValue("password", hash);
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
    }
  );

  return User;
};
