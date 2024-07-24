import express, { Router } from 'express';
import { AppDataSource } from './services/inventory.service';

interface Options {
  port: number;
  routes: Router;
}
export class Server {

  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    this.port = options.port;
    this.routes = options.routes;
  }

  async start() {

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(this.routes)

    AppDataSource.initialize()
      .then(() => {
        console.log('Data Source has been initialized!');

        this.app.listen(this.port, () => {
          console.log(`Server started on port ${this.port}`);
        })

      })
      .catch((error) => console.error('Error during Data Source initialization', error));
  }
}