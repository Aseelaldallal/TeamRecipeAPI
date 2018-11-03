import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { dbURL } from '../config/database';
import { User } from './models/user';

class App {
	public app: express.Application;
	constructor() {
		this.app = express();
		this.connectToDB();
		this.config();
		this.routes();
	}

	private connectToDB = () => {
		mongoose.connect(
			dbURL,
			{ useNewUrlParser: true }
		);
	};

	private config(): void {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}

	private routes(): void {
		const router = express.Router();

		router.get('/', (req: express.Request, res: express.Response) => {
			res.status(200).send({
				message: 'Hello World!'
			});
		});

		router.post('/', (req: express.Request, res: express.Response) => {
			const data = req.body;
			// query a database and save data
			res.status(200).send(data);
		});

		this.app.use('/', router);
	}
}

export default new App().app;
