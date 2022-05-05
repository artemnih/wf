import {determineDependencies} from '../../services/CWLToArgo';
import {expect} from '@loopback/testlab';

describe('Determine Dependencies from Script Array', () => {
  it('No Dependencies', () => {
    const noDepedends = {name: 'hello', name2: 'hello2', input: 'hello3'};
    const returnValue = determineDependencies(noDepedends);
    expect(returnValue).to.be.eql([]);
  });
  it('1 Dependencies', () => {
    const noDepedends = {
      name: 'recycle/hello',
      name2: 'hello2',
      input: 'hello3',
    };
    const returnValue = determineDependencies(noDepedends);
    expect(returnValue.length).to.be.eql(1);
    expect(returnValue[0]).to.be.eql('recycle');
  });
});
