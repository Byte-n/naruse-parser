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

describe('声明变量', () => {
    it('let', () => {
        const exports = run(`
        let cc = 123;
        cc = 321;
        exports.cc = cc;
        `);
        const {
            cc,
            c2
        } = exports;
        expect(cc).to.equal(321);
    });
    it('const', () => {
        const exports = run(`
        const cc = 123;
        exports.cc = cc;
        `);
        const {
            cc,
        } = exports;
        expect(cc).to.equal(123);
    });

    it('var', () => {
        const exports = run(`
        var cc = 123;
        cc = 321;
        exports.cc = cc;
        `);
        const {
            cc,
        } = exports;
        expect(cc).to.equal(321);
    });

    it('change const value should throw error', () => {
        expect(() => {
            run(`
            const cc = 123;
            cc = 321;
            `);
        }).to.throw();
    });
});