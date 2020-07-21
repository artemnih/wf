import { URL } from 'url';
import { IncomingMessage, get } from 'http';

interface Config {
  url: string;
  port: string;
  methods: {
    compute: string;
  };
}

export default class {
  constructor(private config: Config) {}

  compute(script: string) {
    let data = '';

    return new Promise((resolve, reject) => {
      const requestUrl = new URL(this.config.url);
      requestUrl.port = this.config.port;
      requestUrl.pathname = this.config.methods.compute;

      get(requestUrl.toString(), (resp: IncomingMessage) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resp.on('data', (chunk: any) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(data);
        });
      }).on('error', (err: Error) => {
        reject(err.message);
      });
    });
  }
}
