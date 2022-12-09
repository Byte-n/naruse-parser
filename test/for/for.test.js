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
    });

    it('for of 测试', () => {
        const exports = run(`
        const cc = [1,2,3,4,5,6];
        const newCc = [];
        for (let i of cc) {
            newCc.push(i);
        }
        exports.pcr = newCc;
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal([1,2,3,4,5,6]);
    })

    it('for in 测试', () => {
        const exports = run(`
        const cc = {a:1,b:2,c:3};
        const newCc = [];
        for (let i in cc) {
            newCc.push(i);
        }
        exports.pcr = newCc;
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal(['a','b','c']);
    });

    it('break 测试', () => {
        const exports = run(`
        let cc = 1;
        for (var i = 0; i < 100; i++) {
            cc = cc + 1;
            if (i === 50) {
                break;
            }
        }
        exports.pcr = cc;
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal(52);
    })

    it('continue 测试', () => {
        const exports = run(`
        let cc = 1;
        for (var i = 0; i < 100; i++) {
            if (i > 50) {
                continue;
            }
            cc = cc + 1;
        }
        exports.pcr = cc;
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal(52);
    });

    it('return 测试', () => {
        const exports = run(`
        const cc = () => {
            for (let i = 0; i < 10; i++) {
                return 123;
            }
        }
        exports.pcr = cc();
        `);
        const {
            pcr
        } = exports;
        expect(pcr).to.deep.equal(123);
    })
});