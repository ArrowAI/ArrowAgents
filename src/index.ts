import { CronService } from "./services/cron";
import { Engine } from "./engine/engine";
import express from 'express';
import { router } from "./routes/routes";

const engine = new Engine();
const cron = new CronService(engine);
cron.start()


const app = express();

app.use(router);

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
