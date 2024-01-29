import { CronService } from "./services/cron";
import { Engine } from "./engine/engine";

const engine = new Engine();
const cron = new CronService(engine);
cron.start()

//here you can also start the express service so that it can start functions like forced run to test or static trigger instead of automatic trigger.
