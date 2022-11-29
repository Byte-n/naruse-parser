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

describe('运算符', () => {
    it('typeof', () => {
        const exports = run(`
        const pcr = '123';
        exports.cc = typeof pcr;
        exports.c2 = typeof uwer;
        `);
        const {
            cc,
            c2
        } = exports;
        expect(cc).to.equal('string');
        expect(c2).to.equal('undefined');
        
    })
});