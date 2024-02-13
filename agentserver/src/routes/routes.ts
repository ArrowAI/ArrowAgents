import express from 'express';
const router = express.Router();
import * as dotenv from 'dotenv';
dotenv.config();

import { Engine } from './../engine/engine';
const engine = new Engine();
const SERVER_MODE = process.env.SERVER_MODE || "master";

if (SERVER_MODE == "master") {
    router.get('/', (req, res) => {
        res.send('Hello World from master!');
    });
    router.get('/registerslave', (req, res) => {
        res.send('Hello slave!');
    });
    router.get('/registerfunctionexecutor', (req, res) => {

    });
}
else {
    router.get('/', (req, res) => {
        res.send('Hello World from slave!');
    });



}

router.get('/run/:flowId', (req, res) => {
    let response = engine.executeFlow(req.params.flowId);
    res.json(response);
});



export { router };