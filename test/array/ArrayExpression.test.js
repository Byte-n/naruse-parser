import { run } from '../../index.js';
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('元表达式测试', () => {
    const arr = run(`
	var arr = [1, 2, 3];
	arr.push(4);
	exports.arr = arr;
  `);
    it('void', () => {
        expect(arr.arr.length).to.equal(4);
        expect(arr.arr).to.deep.equal([1, 2, 3, 4]);
    });

    it('数组测试2', () => {
        const exports = run(`
function _t(){
    return 1
}
var a = 1;
var arr = [a++, _t() + 2, 3  + 3, undefined];
arr.push(4);
exports.arr = arr;
  `);
        const { arr } = exports;
        expect(Array.isArray(arr)).to.equal(true);
        expect(arr.length).to.equal(5);
        expect(arr).to.deep.equal([1, 3, 6, undefined, 4]);
    });
});
