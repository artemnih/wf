/* eslint-disable @typescript-eslint/no-misused-promises */
import { expect } from '@loopback/testlab';
import { default as axios } from 'axios';
import { readFileSync } from 'fs';
const examplePath = 'examples/CWLWorkflows';
const exampleScripts = 'examples/CLTScripts';
const computeApi = 'http://127.0.0.1:8000/compute/workflows';
const createScripts = 'http://127.0.0.1:8000/compute/plugins';

const postWorkflow = async (path: string) => {
  const json = JSON.parse(readFileSync(path, { encoding: 'utf8' }));
  const req = await axios.post(computeApi, { ...json });
  expect(req.status).to.be.eql(200);
};
const postPlugin = async (path: string) => {
  const json = JSON.parse(readFileSync(path, { encoding: 'utf8' }));
  try {
    await axios.get(`${createScripts}/${json.id}`);
  } catch (_) {
    await axios.post(`${createScripts}`, { ...json });
  }
};

describe('Post Scripts', () => {
  it('Post echo script', async () => {
    await postPlugin(`${exampleScripts}/echo.json`);
  });
  it('Post threshold script', async () => {
    await postPlugin(`${exampleScripts}/threshold.json`);
  });
  it('Post montage script', async () => {
    await postPlugin(`${exampleScripts}/montage.json`);
  });
  it('Post recycle script', async () => {
    await postPlugin(`${exampleScripts}/recycle.json`);
  });
  it('Post assemble script', async () => {
    await postPlugin(`${exampleScripts}/assemble.json`);
  });
});
describe('Submit Regression Tests From Examples', () => {
  it('Run Echo Workflow', async () => {
    await postWorkflow(`${examplePath}/echo.json`);
  });
  it('Run Echo Argo Workflow', async () => {
    await postWorkflow(`${examplePath}/echo-argo.json`);
  });

  it('Run montage-argo workflow', async () => {
    await postWorkflow(`${examplePath}/montage-argo.json`);
  });
  it('Run montage-recycle-argo workflow', async () => {
    await postWorkflow(`${examplePath}/montage-recycle-argo.json`);
  });
  it('Run montage-recycle-assemble workflow', async () => {
    await postWorkflow(`${examplePath}/montage-recycle-assemble.json`);
  });
});
