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

describe('typeof', () => {
    it(' typeof 测试', () => {
        const exports = run(`
        const s = '123';
        const n = 123;

        exports.cc =  {
            s: typeof s,
            n: typeof n,
            u: typeof qwer,
        }
        `);
        const {
            cc
        } = exports;
        expect(cc).deep.equal({
            s: 'string',
            n: 'number',
            u: 'undefined',
        });
    })
});