import { Mongoose, connect, ConnectOptions } from 'mongoose';
import * as mongoose from 'mongoose';
mongoose.set('strictQuery', false);

enum MongoDbConnectionStatusEnum {
  Connected,
  Disconnected, // Deliberately disconnected
}

export class Mongo {
  uri: string;
  db: Mongoose;
  options: ConnectOptions;
  status: MongoDbConnectionStatusEnum;

  buildUri(uri: string): Mongo {
    this.uri = uri;
    return this;
  }

  buildOptions(options: ConnectOptions): Mongo {
    this.options = options;
    return this;
  }

  async connect(): Promise<void> {
    this.db = await mongoose.connect(this.uri, this.options);
    console.log('MongoDB successfully connected');
    this.status = MongoDbConnectionStatusEnum.Connected;

    mongoose.connection.on('disconnected', async (_) => {
      try {
        if (this.status !== MongoDbConnectionStatusEnum.Disconnected) {
          this.db = await mongoose.connect(this.uri, this.options);
          console.log('connect is called in disconnect event', this.uri, this.options);
        }
      } catch (e) {
        console.error(e);
      }
    });
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection lost (error) @ ${this.uri}! Auto-retry is active - check for reconnect event...`, err);
    });
    mongoose.connection.on('reconnectFailed', async (err) => {
      try {
        // all reconnection attempts failed - log fatal right away
        console.error(`MongoDB auto-reconnection failed @ ${this.uri}! Attempting to reset the connection...`, err);

        // start a new connection attempt
        if (this.status !== MongoDbConnectionStatusEnum.Disconnected) {
          setTimeout(async () => {
            this.db = await mongoose.connect(this.uri, this.options);
            console.log('connect is called in reconnectFailed event');
          }, 1500);
        }
      } catch (e) {
        console.error('Attempting to recover from MongoDb reconnect error failed with another exception. The data tier is dead now!', e);
      }
    });
  }

  async disconnect(): Promise<void> {
    try {
      this.status = MongoDbConnectionStatusEnum.Disconnected;
      await this.db.disconnect();
    } catch (error) {
      throw error;
    }
  }
}
