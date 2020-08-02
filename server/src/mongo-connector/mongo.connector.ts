import { MongoClient, Db } from "mongodb";
import { isNull } from "util";
import { threadId } from "worker_threads";
import * as lightsMongo from "./lights.connector";
import { config } from "process";

const HOST = 'localhost';
const PORT = 27017;
const DATABASE = 'sumalux';

export default class MongoConnector {
	connected: boolean;
	host: string;
	port: number;
	private __client: MongoClient;
	private __dbName: string;
	private __db: Db;

	constructor(config) {
		this.host = config.host;
		this.port = config.port ?? 27017;
		this.__dbName = config.dbName;
	}

	async connect(): Promise<MongoClient | void> {
		return await MongoClient.connect(`mongodb://${this.host}:${this.port}`, { useUnifiedTopology: true, })
			.then(client => {
				this.connected = true;	
				this.__client = client;
				this.__db = this.__client.db(this.__dbName);
				return client;
			})
			.catch(err => {
				this.connected = false;
			})
	}

	getDb(): Db {
		return this.__db;
	}
}