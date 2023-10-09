import {
    run
} from '../../dist/dev.esm.js';
import {
    describe,
    it
} from 'mocha';
import {
    expect
} from 'chai';

describe('Symbol测试', () => {
    it('Symbol存在测试', () => {
        expect(() => {
            run(`Symbol('Symbol存在测试')`)
        }).to.not.throw();
    })
    it('Symbol.iterator存在测试', () => {
        const exports = run(`exports.iter = Symbol.iterator`);
        const { iter } = exports;
        expect(iter).to.deep.equal(Symbol.iterator);
    })
});
