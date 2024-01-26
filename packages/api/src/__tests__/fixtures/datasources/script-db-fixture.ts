import { juggler } from '@loopback/repository';

export const scriptTestDb: juggler.DataSource = new juggler.DataSource({
	name: 'ScriptDb',
	connector: 'memory',
});
