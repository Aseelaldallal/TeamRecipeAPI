import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { dbURL } from './config/database';

import { router as teamRouter } from './routes/team';
import { router as userRouter } from './routes/user';
import { router as authRouter } from './routes/auth';

import { passport } from './config/passport';
import * as session from 'express-session';

class App {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.connectToDB();
		this.config();
		this.routes();
		this.handleErrors();
	}

	private connectToDB(): void {
		mongoose.connect(dbURL, { useNewUrlParser: true });
	}

	private config(): void {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.setupPassport();
	}

	private setupPassport(): void {
		this.app.use(
			session({
				secret: 'littlecats',
				saveUninitialized: true,
				resave: true
			})
		);
		this.app.use(passport.initialize());
		this.app.use(passport.session());
	}

	private routes(): void {
		this.app.use('/user', userRouter);
		this.app.use('/team', teamRouter);
		this.app.use('/', authRouter);
	}

	private handleErrors() {
		this.app.use(
			(err: any, req: express.Request, res: express.Response, next: Function) => {
				if (err.code) {
					res.status(err.code).json({ error: err.name, message: err.message });
				} else if (err.name === 'ValidationError') {
					res.status(400).json({ error: err.name, message: err.message });
				} else {
					res.status(500).json({ error: err.name, message: err.message });
				}
				next();
			}
		);
	}
}

export default new App().app;
