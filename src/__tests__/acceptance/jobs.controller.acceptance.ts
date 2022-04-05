import { Client, expect } from '@loopback/testlab';
import { ComputeApplication } from '../..';
import { setupApplication } from './test-helper';

describe('JobController', () => {
  let app: ComputeApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /compute/jobs', async () => {
    const res = await client.get('/compute/jobs').expect(200);
    expect(res.body).to.Array();
  });
});
