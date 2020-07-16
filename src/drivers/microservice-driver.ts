import { ServiceConfig } from '../models/service-config.model';
import { URL } from 'url';
import { IncomingMessage, get } from 'http';

export default class {

    constructor(private config: any) { }

    compute(script: string) {
        let data = '';

        return new Promise((resolve, reject) => {
            console.log('inside the driver')
            const requestUrl = new URL(this.config.url);
            requestUrl.port = this.config.port;
            requestUrl.pathname = this.config.methods.compute;

            get(requestUrl.toString(), (resp: IncomingMessage) => {
                resp.on('data', (chunk: any) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    console.log(data);
                    resolve(data);
                });

            }).on("error", (err) => {
                reject(err.message);
            });
        });
    }
}