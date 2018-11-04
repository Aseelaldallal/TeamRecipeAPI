import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { dbURL } from '../config/database';

import { router as teamRouter } from './routes/teams';

class App {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.connectToDB();
		this.config();
		this.routes();
		this.handleErrors();
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
		this.app.use('/teams', teamRouter);
		this.app.use('/', router);
	}

	private handleErrors() {
		// Expand this later
		this.app.use((err, req, res, next) => {
			if (err.message === 'access denied') {
				res.status(403);
				res.json({ error: err.message });
			}
			next(err);
		});
	}
}

export default new App().app;
