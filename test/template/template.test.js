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

describe('模版字符串', () => {
    it('模版字符串测试', () => {
        const exports = run(`
        const pcr = '123';
        const func = () => 'cc';
        exports.cc = \`this is a \${pcr} and \${func()} pcpcp\`;
        `);
        const {
            cc
        } = exports;
        expect(cc).to.equal('this is a 123 and cc pcpcp');
    })
});