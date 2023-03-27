import { createClient, RedisClientOptions } from "redis";

const options: RedisClientOptions = {
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    timeout: 2000,
  },
  password: process.env.REDIS_PASSWORD,
  database: 0,
};

const client = createClient(options);

client.connect()
  .then(() => console.log("Redis connected"))
  .catch((error) => console.error(error));
export default client;
