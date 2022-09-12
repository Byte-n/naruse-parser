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

describe('对象声明测试', () => {
    it('普通对象声明测试', () => {
        const exports = run(`
        const ww = 123;
        const qc = 'qcqc';
        const pcr = { 1: 123, 2: 123, cc: 123, prc: '123', [ww]: ww, qc };
        exports.pcr = pcr;
        `);
        const {
            pcr
        } = exports;
        const ww = 123;
        const qc = 'qcqc';
        const cc = { 1: 123, 2: 123, cc: 123, prc: '123', [ww]: ww, qc };
        expect(pcr).to.deep.equal(cc);
    })
});