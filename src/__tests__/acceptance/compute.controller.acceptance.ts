
import { ComputeApplication } from '../..';
import { setupApplication } from './test-helper';

describe('ComputeController', () => {
  let app: ComputeApplication;

  before('setupApplication', async () => {
    ({ app } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

});
