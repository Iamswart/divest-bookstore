import fs from "fs";
import path from "path";
import { DataTypes, Sequelize } from "sequelize";
import config from "../../config";
import logger from "../../logger";

const db: any = {};
const sequelize: any = new Sequelize(config.db.url as string, config.db as any);

const extension = process.env.NODE_ENV !== "local" ? ".js" : ".ts";

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === extension
  )
  .forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);

    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


const resolvedConnection = () => logger.info("Connected to database!");

const rejectedConnection = (error: any) =>
  logger.info(`Failed to connect. Error: ${error}`);

sequelize.authenticate().then(resolvedConnection).catch(rejectedConnection);

if (process.env.NODE_ENV === "local") {
  sequelize.sync({ alter: true });
}

export { sequelize };
export default db;
