import pEvent from 'p-event';
import * as http from 'http';
import express from "express";
import mongoose from "mongoose";
import router from "./router";
import cors from "cors";
import jwksRsa from "jwks-rsa";
import { expressjwt } from 'express-jwt';


export class ExpressServer {
  private app: express.Application;
  private server: http.Server;

  constructor(private options: any) {

    const dbUrl = this.options.compute.db.url;
    const dbName = this.options.compute.db.name;
    const dbPort = this.options.compute.db.port;
    const dbUser = this.options.compute.db.username
    const dbPassword = this.options.compute.db.password;
    const connectionString = `mongodb://${dbUser}:${dbPassword}@${dbUrl}:${dbPort}}`;
    const authUrl = this.options.servies.auth.authUrl;

    mongoose.connect(connectionString, {
      dbName: dbName,
    });

    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(
      expressjwt({
        secret: jwksRsa.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${authUrl}/.well-known/jwks.json`,
        }) as any,
        algorithms: ['RS256'],
        issuer: authUrl,
      })
    );
    this.app.use("/compute", router);

    // Serve static files in the public folder
    this.app.use(express.static('public'));
  }

  public async start() {
    this.server = this.app.listen(this.options.rest.port, this.options.rest.host);
    await pEvent(this.server, 'listening');
  }

  public async stop() {
    if (!this.server) return;
    this.server.close();
    await pEvent(this.server, 'close');
  }
}
