export class PackageManager {
  public static async install(pacakgeName: string) {
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
          npm.commands.install([pacakgeName], (er: Error, data: object) => {
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
