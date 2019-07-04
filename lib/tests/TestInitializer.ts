import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

class TestInitializer {
	private mongoServer: MongoMemoryServer;

	constructor() {
		this.mongoServer = new MongoMemoryServer();
	}

	public async start() {
		const mongoUri = await this.mongoServer.getConnectionString();
		await mongoose.connect(mongoUri, { useNewUrlParser: true });
		console.log(`Connected to ${mongoUri}`);
	}

	public end() {
		mongoose.disconnect();
		this.mongoServer.stop();
		console.log('Disconnected');
	}
}

export const Test = new TestInitializer();
