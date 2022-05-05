import {expect} from '@loopback/testlab';
import {ArgoParameters} from '../../services/argoApi';
import {getOutputsFromArgoInputs} from '../../services/argoApi/getOutputsFromArgoInputs';
require('dotenv').config();
const argoConfig = require('config');

const absolutePath = `${argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath}`;

describe('Get Outputs From Argo Inputs', () => {
  it('montage happy path', () => {
    const inputs: ArgoParameters[] = [
      {
        name: 'filePattern',
        value: '{yyy}{xxx}-{r}-001.ome.tif',
      },
      {
        name: 'inpDir',
        value: '/data/inputs/collections/611f403652091f3ee8e9c25a/images',
      },
      {name: 'layout', value: 'r,xy'},
      {name: 'outDir', value: '/data/outputs/montage'},
    ];
    const output = getOutputsFromArgoInputs(inputs, 'montage');
    expect(output).to.be.eql({
      montageoutDir: `${absolutePath}/montage`,
    });
  });
  it('montage no outputs in inputs', () => {
    const inputs: ArgoParameters[] = [
      {
        name: 'filePattern',
        value: '{yyy}{xxx}-{r}-001.ome.tif',
      },
      {
        name: 'inpDir',
        value: '/data/inputs/collections/611f403652091f3ee8e9c25a/images',
      },
      {name: 'layout', value: 'r,xy'},
      {name: 'outDir', value: 'montage'},
    ];
    expect(getOutputsFromArgoInputs(inputs, 'montage')).to.be.eql({});
  });
});
