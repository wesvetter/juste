import assert from 'assert';
import { process } from '../src/index.js';

describe('process', function () {
  it('returns an object with a `result` property', function() {
    const input = 'hello world!';
    const { result } = process(input);
    assert.equal(result, input);
  });
});
