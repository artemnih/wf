import { replaceObjectKey } from '../../../utilities';
import { expect } from '@loopback/testlab';
const testing = {
  name: 'hello',
  man: 'cute',
};
const nestedObject = {
  changeMe: {
    man: 'cute',
  },
};

describe('replaceObjectKey', () => {
  it('Replace object', () => {
    const myObj = replaceObjectKey(testing['name'], 'changeMe', nestedObject);
    expect(myObj).to.be.eql({ hello: { man: 'cute' } });
  });
});
