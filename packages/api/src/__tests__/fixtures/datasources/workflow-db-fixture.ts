import { juggler } from '@loopback/repository';

export const workflowTestDb: juggler.DataSource = new juggler.DataSource({
  name: 'WorkflowDb',
  connector: 'memory',
});
