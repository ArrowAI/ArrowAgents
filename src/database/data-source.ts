import "reflect-metadata";
import { DataSource } from "typeorm";
import { FlowExecutorStore } from "./entity/FlowExecutorStore";

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    entities: [FlowExecutorStore],
    synchronize: true,
    logging: false,
  });

export default AppDataSource;