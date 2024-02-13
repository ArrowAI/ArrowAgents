//Run the Cron for every minute.
import { CronJob } from 'cron';
import { Engine } from '../engine/engine';

//TODO: Refractor the code so that you can use external cron in case of structured Deployment
export class CronService {
    engine: Engine;
    constructor(Engine: Engine) {
        this.engine = Engine;
    }
    start(){
        new CronJob('*/1 * * * * *', () => {
            console.log("running cron every sec");
            this.engine.executeStep();
        }).start();
    }
}