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
    it('提前声明变量后使用 for in or of', () => {
        const exports = run(`
        const cc = () => {
            const ww = { aa: 1, bb:2 };
            let i;
            for (i in ww) {
                exports[i] = ww[i];
            }
        }
        cc();
        `)
        const { aa, bb } = exports;
        expect(aa).to.equal(1);
        expect(bb).to.equal(2);

        const exports2 = run(`
        const cc = () => {
            const ww = [1,2,3];
            let i;
            for (i of ww) {
                exports[i] = i;
            }
        }
        cc();
        `)
        const { 1: one, 2: two, 3: three } = exports2;
        expect(one).to.equal(1);
        expect(two).to.equal(2);
        expect(three).to.equal(3);
    })
});