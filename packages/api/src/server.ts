import * as http from 'http';
import express from "express";
import mongoose from "mongoose";
import { WorkflowRoutes, HealthRoutes } from "./router";
import cors from "cors";
import jwksRsa from "jwks-rsa";
import { expressjwt } from 'express-jwt';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerSchema from './swagger.json';

export class ExpressServer {
  private app: express.Application;
  private server: http.Server;

  constructor(private options: any) {
    const dbName = this.options.compute.db.name;
    const connectionString = this.options.compute.db.connectionString;
    const authUrl = this.options.services.auth.authUrl;

    mongoose.connect(connectionString, {
      dbName: dbName,
    });

    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use('/compute',
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
    this.app.use("/compute", WorkflowRoutes);
    this.app.use("/health", HealthRoutes);

    // Serve static files in the public folder
    this.app.use(express.static('public'));

    const specs = swaggerJsdoc(swaggerSchema);
    this.app.use(
      "/explorer/",
      swaggerUi.serve,
      swaggerUi.setup(specs, { explorer: true })
    );
  }

  public start() {
    this.server = this.app.listen(this.options.rest.port, this.options.rest.host);
  }

  public stop() {
    if (!this.server) return;
    this.server.close();
  }
}
