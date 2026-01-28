import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import Limit from 'express-rate-limit';
import { Mongo } from './core';
import { createServer, Server as HttpServer } from 'http';
import routes from './Routes';
import { BaseMiddleware } from './middlewares';
import * as session from 'express-session';
import { ModernMiddleware } from './middlewares'
import * as fs from 'fs';
import * as path from "path";
const memoryStore = new session.MemoryStore();

export default class Application {
  public server: express.Application;
  public http: HttpServer;
  public mongo: Mongo;
  public mongoUrl: string;
  public protocol: string;
  public host: string;
  public port: number;
  public secret: string;

  constructor(options) {
    this.mongoUrl = options.mongoUrl;
    this.protocol = options.protocol;
    this.host = options.host;
    this.port = options.port;
    this.secret = options.secret;
  }

  start() {
    this.startServer();
    this.connectMongo();
    this.createFolder();
  }

  startServer() {
    let corsOptions = {
      origin: '*',
      methods: 'GET,PUT,POST,DELETE,OPTIONS, PATCH',
      allowedHeaders: ['Content-Type', 'Authorization', 'Lang'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    };
    this.server = express();
    this.server.set('trust proxy', true);
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(bodyParser.json({ limit: '50mb' }));
    this.server.use(express.json());
    this.server.use(
      Limit({
        windowMs: 1000 * 60,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
      }),
    );
    this.server.use(BaseMiddleware);
    this.server.use(cors(corsOptions));
    this.server.use(
      session({
        secret: this.secret,
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
      }),
    );
    this.server.use(ModernMiddleware);
    this.server.use(routes);
    this.http = createServer(this.server);
    this.http.listen(this.port).on('listening', () => {
      console.log(`Server listening on ${this.protocol}://${this.host}:${this.port}`);
      console.log(`Swagger on ${this.protocol}://${this.host}:${this.port}/doc`);
    });
    this.server.use('/images', express.static(path.join(__dirname, '..',process.env.IMAGES_FOLDER_NAME || 'images')));
  }

  connectMongo() {
    this.mongo = new Mongo().buildUri(this.mongoUrl).buildOptions({ autoIndex: false });

    this.mongo.connect().then(() => {
      console.log(`Mongo connect: ${this.mongoUrl}`);
    });
  }

  createFolder() {
    const imagesDir = path.join(__dirname,'..' ,process.env.IMAGES_FOLDER_NAME || 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log('✅ images folder created');
    } else {
      console.log('📁 images folder already exists');
    }
  }
}
