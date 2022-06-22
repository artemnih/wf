import { LogBindings, ServicesLoggerComponent } from '@labshare/services-logger';
import { AuthenticationBindings, ServicesAuthComponent } from '@labshare/services-auth';
import { CacheBindings, ServicesCacheComponent } from '@labshare/services-cache';
import { NotificationsBindings, ServicesNotificationsComponent } from '@labshare/services-notifications';
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import {SECURITY_SCHEME_SPEC} from './utils/security-spec';
import readPkg = require('read-pkg');
import { ServiceMixin } from '@loopback/service-proxy';
import { LabShareSequence } from './sequence';
import { ComputeApiBindings } from './keys';
import path from 'path';
import { DriverFactory } from './drivers/driver-base';

export class ComputeApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // Set up the custom sequence
    this.sequence(LabShareSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    const pkg = readPkg.sync();

    this.api({
      openapi: '3.0.0',
      info: {
        title: 'Compute API',
        version: pkg.version
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [{oauth2: []}],
    });

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
      indexTemplatePath: path.resolve(__dirname, '../explorer/index.html.ejs'),
    });
    this.component(RestExplorerComponent);

    this.setUpBindings(this.options);

    this.setUpComponents();

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpComponents(): void {
    // Binding the services-logger component
    this.component(ServicesLoggerComponent);
    // Binding the services-cache component
    this.component(ServicesCacheComponent);
    // Binding the services-notifications component
    this.component(ServicesNotificationsComponent);

    this.component(ServicesAuthComponent);
  }

  setUpBindings(options: ApplicationConfig): void {
    this.bind('datasources.config.ComputeDS').to(options.compute?.db);
    this.bind(ComputeApiBindings.CONFIG).to(options);
    this.bind(LogBindings.LOG_CONFIG).to(options?.services?.log);
    this.bind(CacheBindings.CACHE_CONFIG).to(options?.services?.cache);
    this.bind(NotificationsBindings.NOTIFICATIONS_CONFIG).to(options?.services?.notifications);
    this.bind(AuthenticationBindings.AUTH_CONFIG).to(options?.services?.auth);

    // Factory that provides available driver instance
    const driverType = process.env.COMPUTE_DRIVER ? process.env.COMPUTE_DRIVER : 'SLURM';
    const factory = DriverFactory.createDriver(driverType);
    this.bind(ComputeApiBindings.DRIVER_FACTORY).to(factory);
  }
}
