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

describe('while 循环测试', () => {
    it('单个 while 测试', () => {
        const exports = run(`
        let cc = 1;
        while (cc < 100) {
            cc = cc + 1;
        }
        exports.pcr = cc;
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal(100);
    });

    it('do while 测试', () => {
        const exports = run(`
        let cc = 1;
        do {
            cc = cc + 1;
        } while (cc < 100);
        exports.pcr = cc;
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal(100);
    });

    it('break 测试', () => {
        const exports = run(`
        let cc = 1;
        while (cc < 100) {
            cc = cc + 1;
            if (cc === 50) {
                break;
            }
        }
        exports.pcr = cc;
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal(50);
    });

    it('continue 测试', () => {
        const exports = run(`
        let cc = 1;
        let cor = 0;
        while (1) {
            cc = cc + 1;
            if (cc === 50) {
                cor = 12;
                continue;
                cor = 16;
            }
            if (cc === 100) {
                break;
            }
        }
        exports.pcr = cor;
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal(12);
    });
});