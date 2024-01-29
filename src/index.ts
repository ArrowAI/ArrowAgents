import { CronService } from "./services/cron";
import { Engine } from "./engine/engine";
import express from 'express';
import { router } from "./routes/routes";
import * as dotenv from 'dotenv';
import { slaveservices } from "./services/slaveservices";

dotenv.config();

const engine = new Engine();
if(!process.env.EXTERNAL_CRON){
    const cron = new CronService(engine);
    cron.start()
}   

const SERVER_MODE = process.env.SERVER_MODE || "master";
if(SERVER_MODE != "master"){
    slaveservices.registerSlaveToMaster();
}

const app = express();
app.use(router);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`AgentFlow Server listening on port ${port}!`);
});
