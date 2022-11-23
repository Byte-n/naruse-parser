import {
    run
} from '../../index.js';
import {
    describe,
    it
} from 'mocha';
import {
    expect
} from 'chai';

describe('for 循环测试', () => {
    it('单个for 测试', () => {
        const exports = run(`
        let cc = 1;
        for (var i = 0; i < 100; i++) {
            cc = cc + 1;
        }
        exports.pcr = cc;
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal(101);
    })
});