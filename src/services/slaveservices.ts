import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

export const slaveservices = {
    registerSlaveToMaster: async () => {
        try {
            const MASTER_API = process.env.MASTER_IP || "localhost";
            const MASTER_PORT = process.env.MASTER_PORT || "3000";
            const response = await axios.post(`http://${MASTER_API}:${MASTER_PORT}/registerslave`, {
                ip: process.env.IP || "localhost"
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}