import { add } from './math';

describe('add', () => {
 it('should correctly add two numbers', () => {
    expect(add(1, 2)).toBe(3);
 });
});