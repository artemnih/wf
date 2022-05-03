export class PackageManager {
  public static async install(packageName: string) {
    return new Promise((resolve, reject) => {
      const npm = require('npm');
      npm.load(
        {
          loaded: false,
        },
        (err: Error) => {
          // catch errors
          if (err) {
            reject(err);
          }
          npm.commands.install([packageName], (er: Error, data: object) => {
            if (er) {
              reject(er);
            }
            resolve(data);
          });
          npm.on('log', (message: string) => {
            // log the progress of the installation
            console.log(message);
          });
        },
      );
    });
  }
}
