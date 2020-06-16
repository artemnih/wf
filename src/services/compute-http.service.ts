import { ServiceConfig } from '../models/service-config.model';
import { URL } from 'url';
import { IncomingMessage, get } from 'http';

export class ComputeHttpService {
  constructor(private config: ServiceConfig) {}

  compute(script: string) {
    let data = '';

    return new Promise((resolve, reject) => {
      const requestUrl = new URL(this.config.url);
      requestUrl.port = this.config.port;
      requestUrl.pathname = this.config.methods.compute;

      get(requestUrl.toString(), (resp: IncomingMessage) => {
        resp.on('data', (chunk: string) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(data);
        });
      }).on('error', (err) => {
        reject(err.message);
      });
    });
  }
}
