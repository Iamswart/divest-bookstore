import Redis from "ioredis";
import logger from "../logger";


const client = new Redis(process.env.REDIS_URL as string)
client.on('connect', () => logger.info('::> Redis Client Connected'));
client.on('error', (err) => console.log('<:: Redis Client Error', err));


export { client };


